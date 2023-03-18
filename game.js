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

var BGImage = new Image();
BGImage.src = "./bg.png";

var buildingImg = new Image();
buildingImg.src = "./building.png";

const keys = {left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown'};
let keyPressed = {up: false, down: false, left: false, right: false};
speed = 8;

class Taxi {
    constructor(){
        this.position = {x:1150, y:250};
        this.velocity = {x:0, y:0};
        this.direction = 'LEFT';
        this.img = taxiLeft;

        this.edges = {left: this.position.x, right: this.position.x + this.img.width, top: this.position.y, bottom: this.position.y + this.img.height};

        this.collider = {
            margins : {x: 0, y: 0},
            width: 130,
            height: 75,
            position: {
                x: 1150,
                y: 250
            }
        }
    }

    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.collider.position.x = this.position.x + this.collider.margins.x;
        this.collider.position.y = this.position.y + this.collider.margins.y;

        this.edges = {left: this.position.x, right: this.position.x + this.img.width, top: this.position.y, bottom: this.position.y + this.img.height};
        this.velocity = {x: 0, y: 0};


        if (keyPressed.right) {
            if (!checkCollision(this.getNextColliderData('RIGHT',0, 0, 130, 75), collider)) {
                this.flip('RIGHT');
                this.velocity.x = speed;
            }
        }

        if (keyPressed.left) {
            if (!checkCollision(this.getNextColliderData('LEFT',0, 0, 152, 75), collider)) {
                this.flip('LEFT');
                this.velocity.x = -speed;
            }
        }
        if (keyPressed.up) {
            if (!checkCollision(this.getNextColliderData('UP',0, 0, 70, 91), collider)) {
                this.flip('UP');
            this.velocity.y = -speed;
            }
        }
        if (keyPressed.down) {
            if (!checkCollision(this.getNextColliderData('DOWN',0, 0, 71, 97), collider)) {
                this.flip('DOWN');
                this.velocity.y = speed;
            }
        }
        if (checkCollision(this, collider)) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }

        // draw image
        ctx.drawImage(this.img, this.position.x,this.position.y,this.img.width,this.img.height);
        // draw collision
        // ctx.fillStyle = '#00ff0050';
        // ctx.fillRect(this.collider.position.x,this.collider.position.y,this.collider.width,this.collider.height);
    }

    flip(direction){
        switch (direction) {
            case 'UP':
                this.img = taxiUp;
                this.adjustPosition('UP');
                this.adjustCollider(0, 0, 70, 91);
                this.direction = "UP";
                break;
            case 'DOWN':
                this.img = taxiDown;
                this.adjustPosition('DOWN');
                this.adjustCollider(0, 0, 71, 97);
                this.direction = "DOWN";
                break;
            case 'LEFT':
                this.img = taxiLeft;
                this.adjustPosition('LEFT');
                this.adjustCollider(0, 0, 130, 75);
                this.direction = "LEFT";
                break;
            case 'RIGHT':
                this.img = taxiRight;
                this.adjustPosition('RIGHT');
                this.adjustCollider(0, 0, 130, 75);
                this.direction = "RIGHT";
                break;
            default:
                break;
        }
    }
    adjustCollider(mx,my,width,height){
        this.collider.margins.x = mx;
        this.collider.margins.y = my;
        this.collider.width = width;
        this.collider.height = height;
    }
    
    getNextColliderData(dir,mx,my,width,height){
        let newImg;
        let imgPosition = {...this.position};
        // Start Imahe Position
        switch (dir) {
            case 'UP':
                newImg = taxiUp;
                if (this.direction === 'LEFT') {
                    imgPosition.y = this.edges.bottom - newImg.height;
                }
                if (this.direction === 'RIGHT') {
                    imgPosition.x = this.edges.right - newImg.width;
                    imgPosition.y = this.edges.bottom - newImg.height;
                }
                break;
            case 'DOWN':
                newImg = taxiDown;
                if (this.direction === 'RIGHT') {
                    imgPosition.x = this.edges.right - newImg.width;
                }
                break;
            case 'LEFT':
                newImg = taxiLeft;
                if (this.direction === 'UP') {
                    imgPosition.x = this.edges.right - newImg.width;
                }
                if (this.direction === 'DOWN') {
                    imgPosition.x = this.edges.right - newImg.width;
                    imgPosition.y = this.edges.bottom - newImg.height;
                }
                break;
            case 'RIGHT':
                newImg = taxiRight;
                if (this.direction === 'DOWN') {
                    imgPosition.y = this.edges.bottom - newImg.height;
                }
                break;
            default:
                break;
        }
        // End Imahe Position
        let colliderData = {velocity: {x: 0, y: 0}, collider: {position: {}}};
        colliderData.collider.position.x = imgPosition.x + mx;
        colliderData.collider.position.y = imgPosition.y + my;
        colliderData.collider.width = width;
        colliderData.collider.height = height;
        return colliderData;
    }
    adjustPosition(targetDirec){
        switch (targetDirec) {
            case 'UP':
                if (this.direction === 'LEFT') {
                    this.position.y = this.edges.bottom - this.img.height;
                }
                if (this.direction === 'RIGHT') {
                    this.position.x = this.edges.right - this.img.width;
                    this.position.y = this.edges.bottom - this.img.height;
                }
                break;
            case 'DOWN':
                if (this.direction === 'RIGHT') {
                    this.position.x = this.edges.right - this.img.width;
                }
                break;
            case 'LEFT':
                if (this.direction === 'UP') {
                    this.position.x = this.edges.right - this.img.width;
                }
                if (this.direction === 'DOWN') {
                    this.position.x = this.edges.right - this.img.width;
                    this.position.y = this.edges.bottom - this.img.height;
                }
                break;
            case 'RIGHT':
                if (this.direction === 'DOWN') {
                    this.position.y = this.edges.bottom - this.img.height;
                }
                break;
            default:
                break;
        }
    }
}

class Background {
    constructor (x, y, width, height) {
        this.width = width;
        this.height = height;
        this.position = {x,y};
    }
    draw() {
        ctx.drawImage(BGImage,this.position.x,this.position.y,this.width,this.height);
    }
}
class GameObject {
    constructor (x, y, width, height, image) {
        this.width = width;
        this.height = height;
        this.position = {x,y};
        this.image = image;
        this.alpha = 1;
    }
    draw() {
        ctx.drawImage(this.image,this.position.x,this.position.y,this.width,this.height);
    }
}
class Collider {
    constructor(x, y, width, height){
        this.collider = { position: {x, y}, width, height }
    }
    draw(){
        ctx.fillStyle = '#00ffff50';
        ctx.fillRect(this.collider.position.x,this.collider.position.y,this.collider.width,this.collider.height);
    }
}
let colliders = [];
let collider;
var background;
BGImage.onload = () => {
    background = new Background(250,150, BGImage.width,BGImage.height);
    collider = new Collider(250,150,BGImage.width,377);
}

buildingImg.onload = () => {
    gameObject = new GameObject(400,17, buildingImg.width,buildingImg.height, buildingImg);
}

let taxi = new Taxi();

window.onload = () => {
    animate();
}

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


/**************************** functions ******************************/
function animate() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    background.draw();
    taxi.update();
    gameObject.draw();
    //collider.draw();
    
    requestAnimationFrame(animate);
}


function checkCollision(ObjOne, Objwo){
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