const mapWidth = 24,
      mapHeight = 24,
      screenWidth = 640,
      screenHeight = 480,
      map = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,2,2,2,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
        [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,3,0,0,0,3,0,0,0,1],
        [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,4,0,0,0,0,5,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,4,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

var posX = 22, posY = 12,
    dirX = -1, dirY = 0,
    planeX = 0, planeY = 0.66,
    time = 0, oldTime = 0;

var config = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var wKey = { },
    aKey = { },
    sKey = { },
    dKey = { };

var game = new Phaser.Game(config);
var graphics = { };

function preload() {
    upKey = this.input.keyboard.addKey("w");
    aKey = this.input.keyboard.addKey("a");
    sey = this.input.keyboard.addKey("s");
    sKey = this.input.keyboard.addKey("d");
}

function create() {
    graphics = this.add.graphics();
}

function update(time, delta) {
    graphics.clear();
    var lines = [];

    for (var x = 0; x < screenWidth; x++) {
        var cameraX = 2 * x / screenWidth - 1,
            rayDirX = dirX + planeX * cameraX,
            rayDirY = dirY = planeY * cameraX,
            mapX = posX, mapY = posY,
            deltaDistX = Math.abs(1 / rayDirX),
            deltaDistY = Math.abs(1 / rayDirY),
            hit = 0,
            sideDistX = 0, sideDistY = 0,
            perpWallDist = 0,
            stepX = 0, stepY = 0
            side = 0;
        
        if (rayDirX < 0) {
            stepX = -1;
            sideDistX = (posX - mapX) * deltaDistX;
        } else {
            stepX = 1;
            sideDistX = (mapX + 1.0 - posX) * deltaDistX;
        }
        
        if (rayDirY < 0) {
            stepY = -1;
            sideDistY = (posY - mapY) * deltaDistY;
        } else {
            stepY = 1;
            sideDistY = (mapY + 1.0 - posY) * deltaDistY;
        }

        while (hit == 0) {
            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0;
            } else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1;
            }

            if (map[mapX][mapY] > 0) hit = 1;
        }

        if (side == 0) perpWallDist = (mapX - posX + (1 - stepX) / 2) / rayDirX;
        else           perpWallDist = (mapY - posY + (1 - stepY) / 2) / rayDirY;

        var lineHeight = screenHeight / perpWallDist,
            drawStart = -lineHeight / 2 + screenHeight / 2,
            drawEnd = lineHeight / 2 + screenHeight / 2;
        
        if (drawStart < 0) drawStart = 0;
        if (drawEnd >= screenHeight) drawEnd = screenHeight - 1;

        var color;

        switch (map[mapX][mapY]) {
            case 1:
                color = 0xFF0000;
                break;
            case 2:
                color = 0x00FF00;
                break;
            case 3:
                color = 0x0000FF;
                break;
            case 4:
                color = 0xFFFFFF;
                break;
            default:
                color = 0xFFFF00;
                break;
        }

        if (side == 1) {
            color /= 2;
        }

        lines.push({
            color: color,
            line: new Phaser.Geom.Line(x, drawStart, x, drawEnd)
        });
    }

    lines.forEach(function(line) {
        graphics.lineStyle(1, line.color);
        graphics.strokeLineShape(line.line);
    })
}