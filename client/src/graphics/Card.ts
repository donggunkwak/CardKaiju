export class Card{
    x:number;
    y:number;
    width:number;
    height:number;
    name:string;
    type:string;
    value:number;
    specialEffect:string;
    scale:number = 1;

    private static images: { CardTemplate: HTMLImageElement | null,
        KingKJuul: HTMLImageElement | null,
     } = {
        CardTemplate:null,
        KingKJuul:null
    }
    private static loaded:boolean = false;

    constructor(x:number, y:number,widthSize:number, name:string, type:string, value:number, specialEffect:string) {
        this.x = x;
        this.y = y;
        this.width=widthSize;
        this.height=widthSize*4/3;
        this.name = name;
        this.type = type;
        this.value = value;
        this.specialEffect = specialEffect;

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
    static loadImages(){
        const imageKeys = Object.keys(Card.images) as (keyof typeof Card.images)[];
    
        for(const image of imageKeys){
            Card.images[image] = new Image();
            Card.images[image].src = `/images/${image}.png`
        }

        console.log("loaded images!");
        Card.loaded = true;
    }

    draw(ctx:CanvasRenderingContext2D){
        if(!Card.loaded){
            console.log("Images not loaded yet");
            return;
        }
            
        const width = this.width*this.scale;
        const height = this.height * this.scale;
        if(Card.images.CardTemplate)
            ctx.drawImage(Card.images.CardTemplate, this.x,this.y, width, height);
        //draw at around 1/8 from left of card, 5/64 from top, 4/9 of the width, and 7/64 (pixels) of the height
        //very poor code lol but just need to set dimensions and stuff
        this.drawFittedText(ctx, this.name, this.x + (width * 4 / 32), this.y + (height * 5 / 64), width*4/9, height*(7/64), 'black');
        this.drawFittedText(ctx, this.value.toString(), this.x + (width * 43 / 64), this.y + (height * 6 / 64), width*(4/32), height*(6/64),'black');

        let typeColor = 'black';
        if(this.type=='alpha')
            typeColor='red';
        else if(this.type=='beta')
            typeColor='blue';
        else if(this.type=='gamma')
            typeColor='yellow'
        else if(this.type=='neutral')
            typeColor='gray'
        this.drawFittedText(ctx, this.typeToText(), this.x + (width * 51 / 64), this.y + (height * 5 / 64), width*(3/32), height*(7/64), typeColor);
        
        this.drawFittedText(ctx, this.specialEffect,  this.x + (width * 4 / 32), this.y + (height * 45 / 64), width*48/64, height*(12/64), 'black')
        
        
        const imageName = this.name.replaceAll(" ","").replaceAll(".","") as keyof typeof Card.images;
        if(Card.images[imageName]){
            ctx.drawImage(Card.images[imageName], this.x+(width*7/64),this.y+(height*13/64), width*(50/64), height*(30/64));
        }
        else{
            this.drawFittedText(ctx, "Image Not Loaded", this.x+(width*7/64),this.y+(height*13/64), width*(50/64), height*(30/64), 'black')
        }
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


    onHover(){
        this.scale=1.5;
    }
    onHoverOut(){
        this.scale=1;
    }
    checkMouseIn(x:number, y:number){
        const width = this.width*this.scale;
        const height = this.height * this.scale;
        return x>this.x&&x<(this.x+width)&&y>this.y&&y<(this.y+height);
    }
    updateMouseOver(x:number, y:number){
        if(this.checkMouseIn(x,y))
            this.onHover();
        else
            this.onHoverOut();
    }
    resize(previousWindowSize:{width:number, height:number}, newWindowSize:{width:number, height:number}){
        console.log(previousWindowSize, newWindowSize);
        const newX = this.x/previousWindowSize.width*newWindowSize.width;
        const newY = this.y/previousWindowSize.height*newWindowSize.height;
        const newWidth = this.width/previousWindowSize.width*newWindowSize.width;
        const newHeight = newWidth*4/3;
        this.x = newX;
        this.y = newY;
        this.width = newWidth;
        this.height = newHeight;
    }
    
}