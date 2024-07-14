class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Calculate the magnitude of the vector
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Calculate the squared magnitude of the vector (faster than mag())
    magSq() {
        return this.x * this.x + this.y * this.y;
    }

    // Add another vector to this vector without modifying this vector
    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    // Subtract another vector from this vector without modifying this vector
    sub(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    // Multiply this vector by a scalar without modifying this vector
    mult(s) {
        return new Vec2(this.x * s, this.y * s);
    }

    // Divide this vector by a scalar without modifying this vector
    div(s) {
        if (s !== 0) {
        return new Vec2(this.x / s, this.y / s);
        } else {
        console.error("Cannot divide by zero.");
        return null;
        }
    }

    // Calculate the heading (angle) of the vector in radians
    heading() {
        return Math.atan2(this.y, this.x);
    }

    // Normalize the vector (make it a unit vector) without modifying this vector
    norm() {
        let m = this.mag();
        if (m !== 0) {
        return this.div(m);
        } else {
        console.error("Cannot normalize a zero vector.");
        return null;
        }
    }

    // Return the absolute value of this vector
    abs() {
        return new Vec2(Math.abs(this.x), Math.abs(this.y));
    }

    toArray() {
        return [this.x,this.y];
    }

    static fromArray(arr) {
        return new Vec2(arr[0], arr[1]);
    }
}

class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Calculate the magnitude of the vector
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    // Calculate the squared magnitude of the vector (faster than mag())
    magSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    // Add another vector to this vector without modifying this vector
    add(v) {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    // Subtract another vector from this vector without modifying this vector
    sub(v) {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    // Multiply this vector by a scalar without modifying this vector
    mult(s) {
        return new Vec3(this.x * s, this.y * s, this.z * s);
    }

    // Divide this vector by a scalar without modifying this vector
    div(s) {
        if (s !== 0) {
        return new Vec3(this.x / s, this.y / s, this.z / s);
        } else {
        console.error("Cannot divide by zero.");
        return null;
        }
    }

    // Calculate the spherical coordinate angles of the vector in radians


    // Normalize the vector (make it a unit vector) without modifying this vector
    norm() {
        let m = this.mag();
        if (m !== 0) {
        return this.div(m);
        } else {
        console.error("Cannot normalize a zero vector.");
        return null;
        }
    }

    // Return the absolute value of this vector
    abs() {
        return new Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    }

    toArray() {
        return [this.x,this.y,this.z];
    }

    static fromArray(arr) {
        return new Vec3(arr[0], arr[1], arr[2]);
    }
}

class Mat3x3 {
    constructor(a1, a2, a3, b1, b2, b3, c1, c2, c3) {
        this.matrix = [
            [a1, a2, a3],
            [b1, b2, b3],
            [c1, c2, c3]
        ];
    }

    mult(other) {
        if (other instanceof Mat3x3) {
            let result = new Mat3x3(
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            );

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    result.matrix[i][j] = 0;
                    for (let k = 0; k < 3; k++) {
                        result.matrix[i][j] += (this.matrix[i][k] * other.matrix[k][j]);
                    }
                }
            }

            return result;
        } else if (other instanceof Vec3) {
            let result = [0,0,0];

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    result[i] += this.matrix[i][j] * other.toArray()[j]
                    //console.log(result[i], this.matrix[i][j], other.toArray()[i])
                }
            }
            return Vec3.fromArray(result);
        }
    }

    add(other) {
        let result = new Mat3x3(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        );

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result.matrix[i][j] = this.matrix[i][j] + other.matrix[i][j];
            }
        }

        return result;
    }

    sub(other) {
        let result = new Mat3x3(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        );

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result.matrix[i][j] = this.matrix[i][j] - other.matrix[i][j];
            }
        }

        return result;
    }

    det() {
        let m = this.matrix;
        return (
            m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
            m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
            m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
        );
    }

    inverse() {
        let det = this.det();
        if (det === 0) {
            console.log("Matrix is singular and cannot be inverted.");
            return new Mat3x3(
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            );
        }

        let m = this.matrix;
        let invDet = 1 / det;

        let result = new Mat3x3(
            invDet * (m[1][1] * m[2][2] - m[1][2] * m[2][1]),
            invDet * (m[0][2] * m[2][1] - m[0][1] * m[2][2]),
            invDet * (m[0][1] * m[1][2] - m[0][2] * m[1][1]),

            invDet * (m[1][2] * m[2][0] - m[1][0] * m[2][2]),
            invDet * (m[0][0] * m[2][2] - m[0][2] * m[2][0]),
            invDet * (m[0][2] * m[1][0] - m[0][0] * m[1][2]),

            invDet * (m[1][0] * m[2][1] - m[1][1] * m[2][0]),
            invDet * (m[0][1] * m[2][0] - m[0][0] * m[2][1]),
            invDet * (m[0][0] * m[1][1] - m[0][1] * m[1][0])
        );

        return result;
    }
}