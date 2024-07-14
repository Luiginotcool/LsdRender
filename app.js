App = {}

Game = {}
Render = {}
Game.player = {}

class Camera {
    constructor(x,y,z,fov,theta,phi) {
        this.pos = new Vec3(x, y, z);
        this.fov = fov;
        this.theta = theta;
        this.phi = phi;
    }
}






App.init = function() {
    App.canvas = document.getElementById("canvas");
    App.width = window.innerWidth;
    App.height = window.innerHeight;
    App.canvas.width = App.width;
    App.canvas.height = App.height;
    App.oldTimeStamp = 0;
    App.frames = 0;
    App.scale = 3;
    App.mouseSensitivity = 0.001;

    canvas.onclick = function() {
        canvas.requestPointerLock();
    }

    App.noLoop = false;

    Input.init();
    console.log(Input.keys)

    Graphics.context = App.canvas.getContext("2d");
    Graphics.fg = "black"
    Graphics.bg = "#776065"

    Game.init();


    window.requestAnimationFrame(App.gameLoop);
}

Game.player.update = function() {
    let s = Game.player.speed * (Input.keys.shift ? 1.5 : 1);
    let scost = s*Math.cos(Game.camera.theta);
    let ssint = s*Math.sin(Game.camera.theta);
    if (Input.keys.up) {
        this.pos = this.pos.add(new Vec2(ssint, -scost));
    }
    if (Input.keys.down) {
        this.pos = this.pos.add(new Vec2(-ssint, scost));
    }
    if (Input.keys.right) {
        this.pos = this.pos.add(new Vec2(scost, ssint));
    }
    if (Input.keys.left) {
        this.pos = this.pos.add(new Vec2(-scost, -ssint));
    }
}

App.gameLoop = function(timeStamp) {
    if (App.noLoop) {
        window.requestAnimationFrame(App.gameLoop);
    } else {
        App.dt = (timeStamp - App.oldTimeStamp);
        App.oldTimeStamp = timeStamp;

        let fps = Math.round(1000 / App.dt);

        Game.update(App.dt);
        Game.draw();

        Graphics.drawFps(fps);
        App.frames++;

        App.noLoop = false;
        window.requestAnimationFrame(App.gameLoop);
    }
}

Game.init = function() {
    Game.player.pos = new Vec2(0, 0)
    Game.player.speed = 0.1;
    Game.fov = 90
    Game.camera = new Camera(0,0,0,Game.fov * Math.PI/180, 0, 0);

    console.log(Geometry.getRotationMatrix(Game.camera.theta, Game.camera.phi));

    Geometry.triArray.push(...Geometry.cube.toTriArray());
}

Game.update = function(dt) {
    Game.player.update();
    Game.camera.pos = new Vec3(Game.player.pos.x, 0, -Game.player.pos.y);
    console.log(Input.mouseX)
    if (document.pointerLockElement === canvas) {
        if (Input.mouseX) {
            Game.camera.theta += Input.mouseX * App.mouseSensitivity;
            Input.mouseX = 0;
        } else {
            Input.mouseX = 0;
        }
    }
    //Game.camera.theta = 0
    //console.log(Game.camera.theta)
}


Game.draw = function() {
    Graphics.background("#776065");
    Graphics.drawTopDown();

    Geometry.triArray.forEach(tri => {
        Render.renderTri(Game.camera, tri);
    })

    //Render.renderTri(Game.camera, Geometry.testTri);
}

Render.realCoordinateToPort = function(camera, realPos) {
    // Rotate coordinate around player by camera heading
    let rotMat = Geometry.getRotationMatrix(Game.camera.theta, Game.camera.phi);
    realPos = realPos.sub(camera.pos);     // Translate so camera is origin
    Graphics.drawTranslated3dPoint(realPos);
    realPosRot = rotMat.mult(realPos)
    realPos = realPosRot.add(camera.pos)

    if (App.frames % 100000 == 0) {
        //console.log(rotMat, realPos, realPosRot)
    }

    

    // Project rotated coordinate
    let screenZ = 1/(Math.tan(camera.fov/2));
    let offset = realPos.sub(camera.pos);
    let rX = offset.x;
    let rY = offset.y;
    let rZ = offset.z;
    if (rZ < 0) {return null}
    let screenX = rX * screenZ / rZ;
    let screenY = rY * screenZ / rZ;
    screenPos = new Vec2(screenX, screenY);
    return screenPos; // Between -1 and 1;
}

Render.renderPoint = function(camera, point) {
    let screenPos = Render.realCoordinateToScreen(camera, point);
    if (!screenPos) {
        return;
    }
    Graphics.drawCircle(screenPos.x, screenPos.y, 3, Graphics.fg);
}

Render.realCoordinateToScreen = function(camera, realPos) {
    realPos = Geometry.vertexToVec3(realPos);
    let vp = Render.realCoordinateToPort(camera, realPos);
    // between -1 and 1 is inside viewport
    if (!vp) {
        return null;
    }
    vp = vp.mult(App.height/2);
    let screenPos = App.CenterTranslate(vp);
    return screenPos;
}

Render.renderTri = function(camera, tri, fill = false) {
    let screenPosArray = []
    for (let i = 0; i < tri.vArray.length; i++) {
        let v = tri.vArray[i]
        let screenPos = Render.realCoordinateToScreen(camera, v);
        if (screenPos == null) {return}
        screenPosArray.push(screenPos);
    }
    if (fill) {
        return;
    }
    else {
        
        tri.vArray.forEach(v => {
            Render.renderPoint(camera, v);
        });
        for (let i = 0; i < 3; i++) {
            Graphics.line(
                screenPosArray[i].x,
                screenPosArray[i].y,
                screenPosArray[(i+1)%3].x,
                screenPosArray[(i+1)%3].y
            )
        }
    }
}

App.CenterTranslate = function(pos) {
    return pos.add(new Vec2(App.width / 2, App.height/2));
};
App.init();
