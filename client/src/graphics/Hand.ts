import { Card } from "./Card";

export class Hand{
    x:number;
    y:number;
    width:number;
    cards:Card[];
    hovered:number;
    constructor(x:number, y:number, width:number, handObjects:any[]){
        this.x=x;
        this.y=y;
        this.width=width;
        this.cards = [];
        this.hovered=-1;


        handObjects.forEach((card,index)=>{
            let handRatio = 0.5;
            if(handObjects.length>1)
                handRatio = index/(handObjects.length-1);
            const cardWidth = this.width/handObjects.length;       
            const cardX = this.x+(handRatio-0.5)*(this.width/2);//linearly for horizontal
            const cardY = this.y+(Math.pow(handRatio-0.5,2))*(cardWidth);// parabola down for card change
            const angle = (-2*handRatio+1)*(-15);
            this.cards.push(new Card(cardX,cardY,cardWidth, card.name, card.type, card.value, card.specialEffect, angle));
        });
        console.log(this.cards);
    }
    draw(ctx:CanvasRenderingContext2D){

        for(let index = this.cards.length-1;index>=0;index--){
            if(index==this.hovered)
                continue;
            this.cards[index].draw(ctx);
        }
        if(this.hovered!=-1){//draw hovered on most top
            this.cards[this.hovered].draw(ctx);
        }
            
    }
    onClick(x:number, y:number){
        this.updateMouseOver(x,y);
        if(this.hovered==-1)
            return;
        console.log("hand clicked");
        this.cards[this.hovered].onClick();
    }
    onRelease(){
        for(const card of this.cards)
            card.unClick();
        this.hovered=-1;
    }
    updateMouseOver(x:number, y:number){
        if(this.hovered!=-1){//only update one card if a card is already hovered.
            const hoveredStatus = this.cards[this.hovered].updateMouseOver(x,y);
            if(!hoveredStatus){
                for(let index =0;index<this.cards.length;index++){
                    if(index==this.hovered)
                        continue;
                    const hoveredStatus = this.cards[index].updateMouseOver(x,y);
                    if(hoveredStatus){
                        this.hovered=index;
                        return;
                    }
                };
                this.hovered=-1;
            }
            return;
        }
        
        for(let index =0;index<this.cards.length;index++){//update hover if no cards are already hovered, starting left to right (order of top to btm).
            const hoveredStatus = this.cards[index].updateMouseOver(x,y);
            if(hoveredStatus){
                this.hovered=index;
                return;
            }
        };
            
    }
    resize(previousWindowSize:{width:number, height:number}, newWindowSize:{width:number, height:number}){
        const newX = this.x/previousWindowSize.width*newWindowSize.width;
        const newY = this.y/previousWindowSize.height*newWindowSize.height;
        const newWidth = this.width/previousWindowSize.width*newWindowSize.width;
        this.x = newX;
        this.y = newY;
        this.width = newWidth;
        for(const card of this.cards)
            card.resize(previousWindowSize,newWindowSize);
    }

}