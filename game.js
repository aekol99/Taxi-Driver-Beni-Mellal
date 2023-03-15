const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')

canvas.width = innerWidth - 4;
canvas.height = innerHeight - 4;

var taxiLeft = new Image();
taxiLeft.src = "./taxiLeft.png";
var taxiRight = new Image();
taxiRight.src = "./taxiRight.png";
var taxiUp = new Image();
taxiUp.src = "./taxiUp.png";
var taxiDown = new Image();
taxiDown.src = "./taxiDown.png";

const keys = {left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown'};
let keyPressed = {up: false, down: false, left: false, right: false};
speed = 8;

class Player {
    constructor(){
        this.position = {x:1000, y:450};
        this.velocity = {x:0, y:0};
        this.direction = 'LEFT';
        this.img = taxiLeft;
        this.imgScale = 0.45;

        this.edges = {left: this.position.x, right: this.position.x + this.img.width * this.imgScale, top: this.position.y, bottom: this.position.y + this.img.height * this.imgScale};

        this.collider = {
            margins : {x: 0, y: 90 * this.imgScale},
            width: 320 * this.imgScale,
            height: 97 * this.imgScale,
            position: {
                x: 1000,
                y: 450
            }
        }
    }

    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.collider.position.x = this.position.x + this.collider.margins.x;
        this.collider.position.y = this.position.y + this.collider.margins.y;

        this.edges = {left: this.position.x, right: this.position.x + this.img.width * this.imgScale, top: this.position.y, bottom: this.position.y + this.img.height * this.imgScale};
        this.velocity = {x: 0, y: 0};


        if (keyPressed.right) {
            this.flip('RIGHT');
            this.velocity.x = speed;
        }

        if (keyPressed.left) {
            this.flip('LEFT');
            this.velocity.x = -speed;
        }
        if (keyPressed.up) {
            this.flip('UP');
            this.velocity.y = -speed;
        }
        if (keyPressed.down) {
            this.flip('DOWN');
            this.velocity.y = speed;
        }
        if (checkCollsion(this, area)) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }

        // draw image
        ctx.drawImage(this.img, this.position.x,this.position.y,this.img.width*this.imgScale,this.img.height*this.imgScale);
        // draw collision
        ctx.fillStyle = '#00ff0020';
        ctx.fillRect(this.collider.position.x,this.collider.position.y,this.collider.width,this.collider.height);
    }

    flip(direction){
        switch (direction) {
            case 'UP':
                this.img = taxiUp;
                this.adjustPosition('UP');
                this.adjustCollider(0, 0, 187, 245);
                this.direction = "UP";
                break;
            case 'DOWN':
                this.img = taxiDown;
                this.adjustPosition('DOWN');
                this.adjustCollider(0, 0, 187, 260);
                this.direction = "DOWN";
                break;
            case 'LEFT':
                this.img = taxiLeft;
                this.adjustPosition('LEFT');
                this.adjustCollider(0, 90, 320, 97);
                this.direction = "LEFT";
                break;
            case 'RIGHT':
                this.img = taxiRight;
                this.adjustPosition('RIGHT');
                this.adjustCollider(0, 90, 320, 97);
                this.direction = "RIGHT";
                break;
            default:
                break;
        }
    }

    adjustCollider(mx,my,width,height){
        this.collider.margins.x = mx * this.imgScale;
        this.collider.margins.y = my * this.imgScale;
        this.collider.width = width * this.imgScale;
        this.collider.height = height * this.imgScale;
    }
    adjustPosition(targetDirec){
        switch (targetDirec) {
            case 'UP':
                if (this.direction === 'LEFT') {
                    this.position.y = this.edges.bottom - this.img.height * this.imgScale;
                }
                break;
            case 'DOWN':
                if (this.direction === 'RIGHT') {
                    this.position.x = this.edges.right - this.img.width * this.imgScale;
                }
                break;
            case 'LEFT':
                if (this.direction === 'UP') {
                    this.position.x = this.edges.right - this.img.width * this.imgScale;
                }
                if (this.direction === 'DOWN') {
                    this.position.x = this.edges.right - this.img.width * this.imgScale;
                    this.position.y = this.edges.bottom - this.img.height * this.imgScale;
                }
                break;
            case 'RIGHT':
                if (this.direction === 'DOWN') {
                    this.position.y = this.edges.bottom - this.img.height * this.imgScale;
                }
                break;
            default:
                break;
        }
    }
}

class Area {
    constructor (x, y, width, height) {
        this.width = width;
        this.height = height;
        this.position = {x,y};
        this.collider = {
            width: width,
            height: height,
            position: {
                x: x,
                y: y
            }
        }
    }
    update() {
        ctx.fillStyle = "#888";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

let area = new Area(400,100,600,300);
let player = new Player();

function animate() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    area.update();
    player.update();
    requestAnimationFrame(animate);
}

animate();

addEventListener('keydown', function (e) {
    if (e.key === keys.left) {
        resetMovementInput(keyPressed);
        keyPressed.left = true;
    }else if (e.key === keys.right) {
        resetMovementInput(keyPressed);
        keyPressed.right = true;
    }
    if (e.key === keys.up) {
        resetMovementInput(keyPressed);
        keyPressed.up = true;
    }else if (e.key === keys.down) {
        resetMovementInput(keyPressed);
        keyPressed.down = true;
    }
});
addEventListener('keyup', function (e) {
    // horizontal keys
    if (e.key === keys.left) {
        keyPressed.left = false;
    }else if (e.key === keys.right) {
        keyPressed.right = false;
    }
    // vertical keys
    if (e.key === keys.up) {
        keyPressed.up = false;
    }else if (e.key === keys.down) {
        keyPressed.down = false;
    }
});


const checkCollision = (objectOne, objectTwo, velocity) => {
    const positionOne = objectOne.position;
    const positionTwo = objectTwo.position;

    const dimentionsOne = objectOne.dimentions;
    const dimentionsTwo = objectTwo.dimentions;

    if (positionOne.x < (positionTwo.x + dimentionsTwo.width - velocity.x) && (positionOne.x + dimentionsOne.width + velocity.x) > positionTwo.x && positionOne.y < (positionTwo.y + dimentionsTwo.height - velocity.y) && (positionOne.y + dimentionsOne.height + velocity.y) > positionTwo.y) {
        return true;
    }
    return false;
}

/**************************** functions ******************************/

function checkCollsion(ObjOne, Objwo){
    if (ObjOne.collider.position.x < (Objwo.collider.position.x + Objwo.collider.width - ObjOne.velocity.x) && (ObjOne.collider.position.x + ObjOne.collider.width + ObjOne.velocity.x) > Objwo.collider.position.x && ObjOne.collider.position.y < (Objwo.collider.position.y + Objwo.collider.height - ObjOne.velocity.y) && (ObjOne.collider.position.y + ObjOne.collider.height + ObjOne.velocity.y) > Objwo.collider.position.y) {
        return true;
    }
    return false;
}

function resetMovementInput(keyPressed){
    for (k in keyPressed){
        keyPressed[k] = false;
    }
}