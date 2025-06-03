import { Card } from "./Card";

export class Hand{
    x:number;
    y:number;
    width:number;
    cards:Card[];
    constructor(x:number, y:number, width:number, handObjects:any[]){
        this.x=x;
        this.y=y;
        this.width=width;
        this.cards = [];


        for(let index = handObjects.length-1;index>=0;index--){
            const card =handObjects[index];
            let handRatio = 0.5;
            if(handObjects.length>1)
                handRatio = index/(handObjects.length-1);
            const cardWidth = this.width/handObjects.length ;       
            const cardX = this.x+(handRatio-0.5)*(this.width/2);//linearly for horizontal
            const cardY = this.y+(Math.pow(handRatio-0.5,2))*(cardWidth);// parabola down for card change
            const angle = (-2*handRatio+1)*(-15);
            this.cards.push(new Card(cardX,cardY,cardWidth, card.name, card.type, card.value, card.specialEffect, angle));
        };
        console.log(this.cards);
    }
    draw(ctx:CanvasRenderingContext2D){
        for(const card of this.cards)
            card.draw(ctx);
    }
    updateMouseOver(x:number, y:number){
        for(const card of this.cards)
            card.updateMouseOver(x,y);
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