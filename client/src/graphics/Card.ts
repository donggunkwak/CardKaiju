import { ImageHandler } from "./ImageHandler";
export class Card{
    originalX:number;
    originalY:number;
    x:number;//center X
    y:number;// center Y
    width:number;
    height:number;
    name:string;
    type:string;
    value:number;
    specialEffect:string;
    scale:number = 1;
    rotatedAngle: number;
    originalAngle:number;
    clicked:boolean = false;

    constructor(x:number, y:number,widthSize:number, name:string, type:string, value:number, specialEffect:string, angle:number) {
        this.originalX=x;
        this.originalY=y;
        this.x = x;
        this.y = y;
        this.width=widthSize;
        this.height=widthSize*4/3;
        this.name = name;
        this.type = type;
        this.value = value;
        this.specialEffect = specialEffect;
        this.rotatedAngle = angle;
        this.originalAngle = angle;

    }
    typeToText(){
        if(this.type=="alpha"){
            return "\u03B1";
        }
        else if(this.type=="beta"){
           return "\u03B2";
        }
        else if(this.type=="gamma"){
            return "\u03B3";
        }
        else{
           return "\u03B7";
        }
    }

    draw(ctx:CanvasRenderingContext2D){
        if(!ImageHandler.loaded){
            console.log("Images not loaded yet");
            return;
        }    
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotatedAngle*Math.PI/180);
        

        const width = this.width*this.scale;
        const height = this.height * this.scale;
        const drawingX = -width/2;
        const drawingY = -height/2;

        const cardTemplateIMG = ImageHandler.images.get('CardTemplate');
        if(cardTemplateIMG!==undefined)
            ctx.drawImage(cardTemplateIMG, drawingX,drawingY, width, height);
        //draw at around 1/8 from left of card, 5/64 from top, 4/9 of the width, and 7/64 (pixels) of the height
        //very poor code lol but just need to set dimensions and stuff
        this.drawFittedText(ctx, this.name, drawingX + (width * 4 / 32), drawingY + (height * 5 / 64), width*4/9, height*(7/64), 'black');
        this.drawFittedText(ctx, this.value.toString(), drawingX + (width * 43 / 64), drawingY + (height * 6 / 64), width*(4/32), height*(6/64),'black');

        let typeColor = 'black';
        if(this.type=='alpha')
            typeColor='red';
        else if(this.type=='beta')
            typeColor='blue';
        else if(this.type=='gamma')
            typeColor='yellow'
        else if(this.type=='neutral')
            typeColor='gray'
        this.drawFittedText(ctx, this.typeToText(), drawingX + (width * 51 / 64), drawingY + (height * 5 / 64), width*(3/32), height*(7/64), typeColor);
        
        this.drawFittedText(ctx, this.specialEffect,  drawingX + (width * 4 / 32), drawingY + (height * 45 / 64), width*48/64, height*(12/64), 'black')
        
        
        const imageName = this.name.replaceAll(" ","").replaceAll(".","");
        const cardIMG = ImageHandler.images.get(imageName);
        if(cardIMG){
            ctx.drawImage(cardIMG, drawingX+(width*7/64),drawingY+(height*13/64), width*(50/64), height*(30/64));
        }
        else{
            this.drawFittedText(ctx, "Image Not Loaded", drawingX+(width*7/64),drawingY+(height*13/64), width*(50/64), height*(30/64), 'black')
        }
        ctx.setTransform(1,0,0,1,0,0);
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

    onClick(){
        this.clicked=true;
    }
    unClick(){
        this.clicked=false;
        this.x=this.originalX;
        this.y=this.originalY;
    }

    onHover(x:number, y:number){
        if(this.clicked){
            this.x=x;
            this.y=y;
        }
        else if(this.scale==1){
            this.scale=1.2;
            this.y = window.innerHeight-(this.height*this.scale)/2
            this.rotatedAngle = 0;
        }
        
    }
    onHoverOut(){
        this.scale=1;
        this.x=this.originalX;
        this.y=this.originalY;
        this.rotatedAngle = this.originalAngle;
    }
    checkMouseIn(x:number, y:number){
        const width = this.width*this.scale;
        const height = this.height * this.scale;

        const relativeX = x - this.x;
        const relativeY = y - this.y;

        const angleRad = -this.rotatedAngle * Math.PI / 180;
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);

        const localX = relativeX * cos - relativeY * sin;
        const localY = relativeX * sin + relativeY * cos;

        return localX > -width/2 && localX < width/2 && localY > -height/2 && localY < height/2;
    }
    updateMouseOver(x:number, y:number){
        if(this.checkMouseIn(x,y)){
            this.onHover(x,y);
            return true;
        }
        else{
            this.onHoverOut();
            return false;
        }
            
    }
    resize(previousWindowSize:{width:number, height:number}, newWindowSize:{width:number, height:number}){
        const newX = this.x/previousWindowSize.width*newWindowSize.width;
        const newY = this.y/previousWindowSize.height*newWindowSize.height;
        const newOriginalX = this.originalX/previousWindowSize.width*newWindowSize.width;
        const newOriginalY = this.originalY/previousWindowSize.height*newWindowSize.height;
        const newWidth = this.width/previousWindowSize.width*newWindowSize.width;
        const newHeight = newWidth*4/3;
        this.x = newX;
        this.y = newY;
        this.width = newWidth;
        this.height = newHeight;
        this.originalX = newOriginalX;
        this.originalY = newOriginalY;
    }
    
}