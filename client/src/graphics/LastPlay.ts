import { Card } from "./Card";

export class LastPlay{
    x:number;//centerX
    y:number;//centerY
    cardDistance:number;
    cardWidth:number;
    cardLeft:any=null;
    cardRight:any=null;
    lastPlays:any[];
    flippedCard = 0;
    animated = false;

    animationStartTime: number = 0;
    animationDuration: number = 1000; // 1 second flip animation
    
    constructor(x:number,y:number,cardDistance:number,cardWidth:number, lastPlays:any[], playerNum:number){
        this.x=x;
        this.y=y;
        this.cardDistance=cardDistance;
        this.cardWidth=cardWidth;
        this.lastPlays=lastPlays;
        if(playerNum==1)
            this.flippedCard = 2;
        else
            this.flippedCard = 1;
        this.setCards();
    }
    draw(ctx:CanvasRenderingContext2D){
        if(this.cardLeft!=null&&this.cardRight!=null){
            if(!this.animated){
                this.animated=true;
                this.animationStartTime = Date.now();
            }
            const currentTime = Date.now();
            const elapsed = currentTime - this.animationStartTime;
            const flipProgress = Math.min(elapsed / this.animationDuration, 1);
            if(flipProgress >= 1) {
                this.animated = false;
                this.cardLeft=null;
                this.cardRight=null;
            }
            else{

            }
        }
        else if(this.cardLeft!=null){
            this.cardLeft.draw(ctx);
        }
        else if(this.cardRight!=null){
            this.cardRight.draw(ctx);
        }
    }
    setCards(){
        if(this.lastPlays[0]!=null){
            this.cardLeft = new Card(this.x-this.cardWidth/2,this.y,this.cardWidth,
                this.lastPlays[0].name,this.lastPlays[0].type,this.lastPlays[0].value,this.lastPlays[0].specialEffect,0);
        }
        if(this.lastPlays[1]!=null){
            this.cardLeft = new Card(this.x+this.cardWidth/2,this.y,this.cardWidth,
                this.lastPlays[1].name,this.lastPlays[1].type,this.lastPlays[1].value,this.lastPlays[1].specialEffect,0);
        }
    }
    resize(previousWindowSize:{width:number, height:number}, newWindowSize:{width:number, height:number}){
        const newX = this.x/previousWindowSize.width*newWindowSize.width;
        const newY = this.y/previousWindowSize.height*newWindowSize.height;
        const newCardDistance = this.cardDistance/previousWindowSize.width*newWindowSize.width;
        const newCardWidth = this.cardWidth/previousWindowSize.width*newWindowSize.width;
        this.x = newX;
        this.y = newY;
        this.cardDistance = newCardDistance;
        this.cardWidth=newCardWidth;
        this.setCards();
    }
}