export class Header{
    username1:string;
    username2:string;
    roomCode:string;
    points:number[][];
    widthRatio=0.9;
    heightRatio=0.1;
    constructor(username1:string,username2:string,roomCode:string,points:number[][]){
        this.username1=username1;
        this.username2=username2;
        this.roomCode=roomCode;
        this.points=points;
    }
    draw(ctx:CanvasRenderingContext2D){//just do everything dynamically since not much computation
        
        const width = ctx.canvas.width*this.widthRatio;
        const height = ctx.canvas.height*this.heightRatio;
        const centerX = ctx.canvas.width/2;
        const centerY = (height)/2;

        const drawingX = centerX-width/2;
        const drawingY = centerY-height/2;

        //overall background
        ctx.fillStyle = "#1eb9bb"
        ctx.beginPath();
        ctx.roundRect(drawingX,drawingY,width,height,[0,0,30,30]);//overall background
        ctx.fill();

        //player 1 name and score
        let tempWidth = width*0.375;//0.2+0.375+0.375 = 0.95, which leaves 0.05 of the overall background visible, or 0.025 of the side
        const startXP1 = drawingX+width*0.025;
        ctx.fillStyle="gray"
        ctx.fillRect(startXP1,drawingY,tempWidth,height);

        this.drawFittedTextExtra(ctx,this.username1,startXP1,drawingY,width*0.35,height/2,'black','left');
        this.drawFittedTextExtra(ctx,`\u03B1: ${this.points[0][0]} \u03B2: ${this.points[0][1]} \u03B3: ${this.points[0][2]}`,startXP1,drawingY+height/2,width*0.35,height/2,'black','left');
        //player 2 name and score
        tempWidth = width*0.375;//same thing but on opposite end
        const startXP2 = drawingX+width*0.975-tempWidth;
        ctx.fillStyle="gray"
        ctx.fillRect(startXP2,drawingY,tempWidth,height);

        this.drawFittedTextExtra(ctx,this.username2,startXP2,drawingY,width*0.375,height/2,'black','right');
        this.drawFittedTextExtra(ctx,`\u03B1: ${this.points[1][0]} \u03B2: ${this.points[1][1]} \u03B3: ${this.points[1][2]}`,startXP2,drawingY+height/2,width*0.375,height/2,'black','right');

        //roomcode outer background
        ctx.beginPath();
        tempWidth = width*0.25;
        ctx.fillStyle="black"
        ctx.roundRect(centerX-tempWidth/2,drawingY,tempWidth,height,[0,0,20,20]);
        ctx.fill();
        //roomcode inner background
        tempWidth= tempWidth*0.9;
        ctx.fillStyle="gray"
        ctx.fillRect(centerX-tempWidth/2,drawingY,tempWidth,height);
        //roomcode
        this.drawFittedTextExtra(ctx,"Room",centerX-tempWidth/2,drawingY,tempWidth,height/2,'black','center');
        this.drawFittedTextExtra(ctx,this.roomCode,centerX-tempWidth/2,drawingY+height/2,tempWidth,height/2,'black','center');
        
    }
    private drawFittedTextExtra(
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        maxHeight: number,
        color: string,
        orientation:'left'|'right'|'center',
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
        
        ctx.fillStyle = color; 
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const textCenterX = x + (maxWidth/2);
        const textCenterY = y + (maxHeight / 2) ;

        if(orientation=='left'){
            this.texter(ctx,text,x,textCenterY,color);
            // ctx.fillText(text, x, textCenterY);
        }
        else if(orientation=='right'){
            this.texter(ctx,text, x+maxWidth-ctx.measureText(text).width,textCenterY,color);
            // ctx.fillText(text, x+maxWidth, textCenterY);
        }
        else if(orientation=='center'){
            ctx.textAlign='center';
            ctx.fillText(text,textCenterX,textCenterY);
        }
        // ctx.strokeStyle = 'red';
        // ctx.strokeRect(x, y, maxWidth, maxHeight);
    }
    private texter(ctx:CanvasRenderingContext2D, str:string, x:number, y:number, originalColor:string){
        for(var i = 0; i <= str.length; ++i){
            var ch = str.charAt(i);
            if(ch=="\u03B1")
                ctx.fillStyle="red";
            else if(ch=="\u03B2")
                ctx.fillStyle="blue";
            else if(ch=="\u03B3")
                ctx.fillStyle="yellow";
            else
                ctx.fillStyle=originalColor;
            ctx.fillText(ch, x, y);
            x += ctx.measureText(ch).width;
        }
    }
}