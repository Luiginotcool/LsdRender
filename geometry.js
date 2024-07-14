class Tri {
    constructor(v1,v2,v3) { //vertecies [x,y,z]
        this.vArray = [v1,v2,v3];
    }
}

class Polyhedron {
    constructor(faceArray) {
        this.faceArray = faceArray;
    }

    toTriArray() {
        let triArr = [];
        this.faceArray.forEach(vArray => {
            triArr.push(...Geometry.pointsToTris( //Spread operator
                Geometry.translateVertexArray(vArray, new Vec3(0,0,5)) 
            ));
        });
        return triArr;
    }
}

Geometry = {}
Geometry.triArray = []

Geometry.pointsToTris = function(vArray) {
    let n = vArray.length;
    let triArray = [];
    for (let i = 1; i < n-1; i++) {
        triArray.push(new Tri(
            vArray[0],
            vArray[i],
            vArray[i+1]
        ))
    }

    return triArray;
}

Geometry.vertexToVec3 = function(vertex) {
    return new Vec3(vertex[0], vertex[1], vertex[2])
}

Geometry.vertexArrToVec3Arr = function(vArr) {
    let vecArr = []
    vArr.forEach(vertex => {
        vecArr.push(Geometry.vertexToVec3(vertex));
    });
}

Geometry.cubeFaces = {
    north: [[-1,-1,1],[-1,1,1],[1,1,1],[1,-1,1]],
    east: [[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]],
    south: [[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]],
    west: [[-1,-1,-1],[-1,1,-1],[-1,1,1],[-1,-1,1]],
    top: [[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]],
    bottom: [[-1,-1,-1],[-1,-1,1],[1,-1,1],[1,-1,-1]],
}

Geometry.translateVertexArray = function(vArray, offset) {
    let newArray = []
    vArray.forEach(v => {
        newArray.push([v[0] + offset.x, v[1] + offset.y, v[2] + offset.z]);
    });
    return newArray;
}

Geometry.cube = new Polyhedron([
    Geometry.cubeFaces.north,
    Geometry.cubeFaces.east,
    Geometry.cubeFaces.south,
    Geometry.cubeFaces.west,
    Geometry.cubeFaces.top,
    Geometry.cubeFaces.bottom,
])

Geometry.getRotationMatrix = function(theta, phi) {
    let cosT = Math.cos(theta);
    let sinT = Math.sin(theta);
    let cosP = Math.cos(phi);
    let sinP = Math.sin(phi);

    let Ry = new Mat3x3(cosT , 0, -sinT, 0, 1, 0, sinT, 0, cosT);
    let Rx = new Mat3x3(1, 0, 0, 0, cosP, -sinP, 0, sinP, cosP);
    return Ry.mult(Rx);
}

