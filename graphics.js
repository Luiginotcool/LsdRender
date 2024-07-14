Graphics = {}

Graphics.drawTopDown = function() {
    let playerPos = Game.player.pos.mult(100).add(new Vec2(App.width/2, App.height/2));
    let heading = Game.camera.theta;
    let sin = Math.sin(heading);
    let cos = Math.cos(heading);
    Graphics.drawCircle(playerPos.x, playerPos.y, 10, Graphics.fg);
    Graphics.drawArrow(playerPos.x, playerPos.y, playerPos.x + 100 * sin, playerPos.y + 100 * -cos);
}

Graphics.drawArrow = function(startX, startY, endX, endY, arrowSize) {
    var context = Graphics.context;
    context.fillStyle = Graphics.fg
    // Calculate arrow angle
    var angle = Math.atan2(endY - startY, endX - startX);

    // Draw line
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();

    // Draw arrowhead
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
    context.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
    context.closePath();
    context.fill();
}

Graphics.line = function(x1, y1, x2, y2, colour = Graphics.fg) {
    let context = Graphics.context;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2,y2);
    context.stroke();
}

Graphics.drawFps = function(fps) {
    Graphics.context.fillStyle = "white";
    //Graphics.context.fillRect(0,0,200,100);
    Graphics.context.font = "15px Arial";
    Graphics.context.fillText(`${fps} fps`, 10, 30);
    Graphics.context.fillText(`Heading: ${Game.camera.theta}`, 80, 30)
}

Graphics.background = function(colour = Graphics.bg) {
    Graphics.context.fillStyle = colour;
    Graphics.context.fillRect(0, 0, App.canvas.width, App.canvas.height);
}

Graphics.fillRect = function(x, y, w, h, colour = Graphics.fg) {
    Graphics.context.fillStyle = colour;
    Graphics.context.fillRect(x, y, w, h)
}

Graphics.drawCircle = function(x, y, radius, fill, stroke, strokeWidth) {
    let ctx = Graphics.context
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fill()
    }
    if (stroke) {
      ctx.lineWidth = strokeWidth
      ctx.strokeStyle = stroke
      ctx.stroke()
    }
}

Graphics.drawTranslated3dPoint = function(realPosition) {
    let trans = App.CenterTranslate(new Vec2(realPosition.x, -realPosition.z));
    Graphics.drawCircle(trans.x, trans.y, 2);
}