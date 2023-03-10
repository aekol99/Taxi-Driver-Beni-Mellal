const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')

canvas.width = innerWidth - 4;
canvas.height = innerHeight - 4;

const keys = {left: 'ArrowLeft', right: 'ArrowRight', top: 'ArrowUp', bottom: 'ArrowDown'};
let keyPressed = {top: false, down: false, left: false, right: false};
speed = 10;

class Player {
    constructor(){
        this.width = 160;
        this.height = 80;
        this.position = {x:1000, y:450};
        this.velocity = {x:0, y:0};
        this.direction = 'LEFT';
    }

    draw(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.physics();
        ctx.fillStyle = '#f00';
        ctx.fillRect(this.position.x,this.position.y,this.width,this.height);
    }
    flip(direction){
        switch (direction) {
            case 'TOP':
                this.width = 80;
                this.height = 160;
                if(this.direction === 'LEFT'){
                        this.position.x = this.position.x;
                        this.position.y = this.position.y - this.width;
                }
                if(this.direction === 'RIGHT'){
                    this.position.x = this.position.x + this.width;
                    this.position.y = this.position.y - this.width
                }
                this.direction = 'TOP';
                break;
            case 'DOWN':
                this.width = 80;
                this.height = 160;
                if(this.direction === 'LEFT'){
                    this.position.x = this.position.x;
                }
                if(this.direction === 'RIGHT'){
                    this.position.x = this.position.x + this.width;
                }
                this.direction = 'DOWN';
                break;
            case 'LEFT':
                this.width = 160;
                this.height = 80;
                if(this.direction === 'TOP'){
                    this.position.y = this.position.y;
                    this.position.x = this.position.x - this.height
                }
                if(this.direction === 'DOWN'){
                    this.position.y = this.position.y + this.height;
                    this.position.x = this.position.x - this.height

                }
                this.direction = 'LEFT';
                break;
            case 'RIGHT':
                this.width = 160;
                this.height = 80;
                if(this.direction === 'TOP'){
                    this.position.y = this.position.y;
                }
                if(this.direction === 'DOWN'){
                    this.position.y = this.position.y + this.height;
                }
                this.direction = 'RIGHT';
                break;
            default:
                break;
        }
    }
    move(){
        this.velocity.x = 0;
        this.velocity.y = 0;

        if (keyPressed.right) {
            let target = this;
            if (this.direction === "TOP" || this.direction === "DOWN") {
                let newObj = {...this, width: 160, height: 80};
                if (this.direction === "DOWN") {
                    newObj = {...newObj, position: {...newObj.position, y: newObj.position.y + 80}};
                }
                target = newObj;
            }

            if (!this.checkCollsion(target, area)) {
                this.flip('RIGHT');
                this.velocity.x = speed;
            }
        }
        if (keyPressed.left) {
            let target = this;
            if (this.direction === "TOP" || this.direction === "DOWN") {
                let newObj = {...this, width: 160, height: 80, position: {...this.position, x: this.position.x - 80}};
                if (this.direction === "DOWN") {
                    newObj = {...newObj, position: {...newObj.position, y: newObj.position.y + 80}};
                }
                target = newObj;
            }

            if (!this.checkCollsion(target, area)) {
                this.flip('LEFT');
                this.velocity.x = -speed;
            }
        }
        if (keyPressed.top) {
            let target = this;
            if (this.direction === "LEFT" || this.direction === "RIGHT") {
                let newObj = {...this, width: 80, height: 160, position: {...this.position, y: this.position.y - 80}};
                if (this.direction === "RIGHT") {
                    newObj = {...newObj, position: {...newObj.position, x: newObj.position.x + 80}};
                }
                target = newObj;
            }

            if (!this.checkCollsion(target, area)) {
                this.flip('TOP');
                this.velocity.y = -speed;
            }
            
        }
        if (keyPressed.bottom) {
            let target = this;
            if (this.direction === "LEFT" || this.direction === "RIGHT") {
                let newObj = {...this, width: 80, height: 160};
                if (this.direction === "RIGHT") {
                    newObj = {...newObj, position: {...newObj.position, x: newObj.position.x + 80}};
                }
                target = newObj;
            }

            if (!this.checkCollsion(target, area)) {
                this.flip('DOWN');
                this.velocity.y = speed;
            }
        }
    }
    physics(){
        this.move();
        if (this.checkCollsion(this, area)) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
    }
    checkCollsion(targetOne, targetwo){
        if (targetOne.position.x < (targetwo.position.x + targetwo.width - targetOne.velocity.x) && (targetOne.position.x + targetOne.width + targetOne.velocity.x) > targetwo.position.x && targetOne.position.y < (targetwo.position.y + targetwo.height - targetOne.velocity.y) && (targetOne.position.y + targetOne.height + targetOne.velocity.y) > targetwo.position.y) {
            return true;
        }
        return false;
    }
}

class Area {
    constructor (x, y, width, height) {
        this.width = width;
        this.height = height;
        this.position = {x,y};
    }
    draw() {
        ctx.fillStyle = "#888";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

let area = new Area(400,100,600,300);
let player = new Player();

function animate() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    area.draw();
    player.draw();
    requestAnimationFrame(animate);
}

animate();

function resetMovementInput(keyPressed){
    for (k in keyPressed){
        keyPressed[k] = false;
    }
}
resetMovementInput(keyPressed, "top");

addEventListener('keydown', function (e) {
    if (e.key === keys.left) {
        resetMovementInput(keyPressed);
        keyPressed.left = true;
    }else if (e.key === keys.right) {
        resetMovementInput(keyPressed);
        keyPressed.right = true;
    }
    if (e.key === keys.top) {
        resetMovementInput(keyPressed);
        keyPressed.top = true;
    }else if (e.key === keys.bottom) {
        resetMovementInput(keyPressed);
        keyPressed.bottom = true;
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
    if (e.key === keys.top) {
        keyPressed.top = false;
    }else if (e.key === keys.bottom) {
        keyPressed.bottom = false;
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