export class WinGraphic{
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
    draw(ctx:CanvasRenderingContext2D, winner:string){
        ctx.fillStyle='black';
        ctx.beginPath();
        ctx.roundRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height,[10,10,10,10]);
        ctx.fill();
        this.drawFittedText(ctx,`${winner} has won!`,this.x-this.width/2,this.y-this.height/2,this.width,this.height,'white');

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

    private drawFittedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number,
    color: string
    ) 
    {
        // Start with a reasonable font size
        let fontSize = Math.min(maxWidth, maxHeight);
        let font = `${fontSize}px Arial`;
        
        ctx.font = font;
        let textMetrics = ctx.measureText(text);
        
        // Reduce font size until text fits both width and height constraints
        while ((textMetrics.width > maxWidth || fontSize > maxHeight) && fontSize > 8) {
            fontSize -= 1;
            font = `${fontSize}px Arial`;
            ctx.font = font;
            textMetrics = ctx.measureText(text);
        }
        const textCenterX = x + (maxWidth/2);
        const textCenterY = y + (maxHeight / 2) ;
        
        ctx.fillStyle = color; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillText(text, textCenterX, textCenterY);
        // ctx.strokeStyle = 'red';
        // ctx.strokeRect(x, y, maxWidth, maxHeight);
    }
}