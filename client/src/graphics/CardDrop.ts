export class CardDrop{
    x:number;//centerX
    y:number;//centerY
    width:number;
    height:number;
    constructor(x:number,y:number,width:number,height:number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height=height;
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.fillStyle='rgba(73, 231, 122,0.5)';
        ctx.beginPath();
        ctx.roundRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height,[10,10,10,10]);
        ctx.fill();

    }
    resize(previousWindowSize:{width:number, height:number}, newWindowSize:{width:number, height:number}){
        const newX = this.x/previousWindowSize.width*newWindowSize.width;
        const newY = this.y/previousWindowSize.height*newWindowSize.height;
        const newWidth = this.width/previousWindowSize.width*newWindowSize.width;
        const newHeight = this.height/previousWindowSize.height*newWindowSize.height;
        this.x = newX;
        this.y = newY;
        this.width = newWidth;
        this.height = newHeight;
    }
    mouseIn(x:number, y:number){
        return x>(this.x-this.width/2) && x<(this.x+this.width/2)&&y>(this.y-this.height/2)&&y<(this.y+this.height/2);
    }
}