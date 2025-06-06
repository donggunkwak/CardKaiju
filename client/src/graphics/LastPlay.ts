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
    roundWinner:number;
    confetti:Confetti|null;

    animationStartTime: number = 0;
    animationDuration: number = 2000; // 1 second flip animation
    
    constructor(x:number,y:number,cardDistance:number,cardWidth:number, lastPlays:any[], playerNum:number, roundWinner:number){
        this.x=x;
        this.y=y;
        this.cardDistance=cardDistance;
        this.cardWidth=cardWidth;
        this.lastPlays=lastPlays;
        this.roundWinner=roundWinner;
        if(playerNum==1)
            this.flippedCard = 2;
        else
            this.flippedCard = 1;

        this.confetti=null;
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
            const flipProgress = elapsed / this.animationDuration;//wait 
            if(flipProgress >= 2) {
                this.animated = false;
                this.cardLeft=null;
                this.cardRight=null;
                this.confetti=null;
            }
            else if(flipProgress>=1){
                this.cardRight.draw(ctx);
                this.cardLeft.draw(ctx);
                if(this.roundWinner==1&&this.confetti==null){
                    this.confetti=new Confetti(this.cardLeft.x, this.cardLeft.y, this.cardLeft.width,this.cardLeft.height);
                }
                else if(this.roundWinner==2&&this.confetti==null){
                    this.confetti=new Confetti(this.cardRight.x, this.cardRight.y, this.cardRight.width,this.cardRight.height);
                }
                if(this.confetti!=null){
                    this.confetti.draw(ctx);
                }
                    
            }
            else{
                if(this.flippedCard==1){
                    this.cardRight.draw(ctx);
                    this.cardLeft.draw(ctx,flipProgress);
                }
                else{
                    this.cardLeft.draw(ctx);
                    this.cardRight.draw(ctx,flipProgress);
                }
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
            this.cardLeft = new Card(this.x-this.cardDistance/2,this.y,this.cardWidth,
                this.lastPlays[0].name,this.lastPlays[0].type,this.lastPlays[0].value,this.lastPlays[0].specialEffect,0);
        }
        else{
            this.cardLeft=null;
        }
        if(this.lastPlays[1]!=null){
            this.cardRight = new Card(this.x+this.cardDistance/2,this.y,this.cardWidth,
                this.lastPlays[1].name,this.lastPlays[1].type,this.lastPlays[1].value,this.lastPlays[1].specialEffect,0);
        }
        else{
            this.cardRight=null;
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

class Confetti{
    x:number;//centerX
    y:number;//centerY
    width:number;
    height:number;
    confetti:any[] = [];
    time = 0;
    constructor(x:number, y:number, width:number, height:number){
        this.x = x;
        this.y = y;
        this.width = width;
        let colors = [
            "#10b981",
            "#7c3aed",
            "#fbbf24",
            "#ef4444",
            "#3b82f6",
            "#22c55e",
            "#f97316",
            "#ef4444",
        ]
        this.height = height;
        for (let i = 0; i < 40; i++) {
            const radius = Math.floor(Math.random() * 50) - 10
            const tilt = Math.floor(Math.random() * 10) - 10
            const xSpeed = Math.random() * 0.5 - 0.25
            const ySpeed = Math.random() * 3
            const x = this.x-this.width/2+Math.random() * width;
            const y = this.y-this.height/2+Math.random() * height;

            this.confetti.push({
                x:x,
                y:y,
                xSpeed:xSpeed,
                ySpeed:ySpeed,
                radius:radius,
                tilt:tilt,
                color: colors[Math.floor(Math.random() * colors.length)],
                phaseOffset: i, // Randomness from position in list
            })
        }
    }
    draw(ctx:CanvasRenderingContext2D){
        this.confetti.forEach((piece, i) => {
            piece.y += (Math.cos(piece.phaseOffset + this.time) + 1) * 1 + piece.ySpeed;
            piece.x += Math.sin(piece.phaseOffset + this.time) * 0.5 + piece.xSpeed;
            if (piece.x<this.x-this.width/2) piece.x = this.x+this.width/2;
            if (piece.x > this.x+this.width/2) piece.x = this.x-this.width/2;
            if (piece.y > this.y+this.height/2) piece.y = this.y-this.height/2;
            ctx.beginPath();
            ctx.lineWidth = piece.radius / 2;
            ctx.strokeStyle = piece.color;
            ctx.moveTo(piece.x + piece.tilt + piece.radius / 4, piece.y);
            ctx.lineTo(piece.x + piece.tilt, piece.y + piece.tilt + piece.radius / 4);
            ctx.stroke();
        })
        this.time+=0.05;
    }

}