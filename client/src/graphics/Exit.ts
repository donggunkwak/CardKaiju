import { ImageHandler } from "./ImageHandler";

export class Exit{
    x:number;
    y:number;
    length:number;
    constructor(x:number,y:number,length:number){
        this.x = x;
        this.y = y;
        this.length = length;
    }
    draw(ctx:CanvasRenderingContext2D){
        const exitIMG = ImageHandler.images.get('exit')
        if(exitIMG)
            ctx.drawImage(exitIMG,this.x,this.y,this.length,this.length);

    }
    resize(previousWindowSize:{width:number, height:number}, newWindowSize:{width:number, height:number}){
        const newX = this.x/previousWindowSize.width*newWindowSize.width;
        const newY = this.y/previousWindowSize.height*newWindowSize.height;
        const newLength = this.length/previousWindowSize.width*newWindowSize.width;
        this.x = newX;
        this.y = newY;
        this.length = newLength;
    }
    mouseIn(x:number, y:number){
        return x>this.x && x<(this.x+this.length)&&y>this.y&&y<(this.y+this.length);
    }
}