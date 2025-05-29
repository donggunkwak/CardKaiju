const {Card} = require('./Card.js')
const fs = require('fs');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

class GameState{
    constructor(){
        this.decks = [[],[]];//Cards
        const lines = fs.readFileSync('card.txt', 'utf-8').split('\n').filter(Boolean);
        lines.forEach((line) => {
            const {name, type, value, effect} = line.split("|");
            this.decks[0].push(new Card(name.trim(),type.trim(),value.trim(),effect.trim()));
            this.decks[1].push(new Card(name.trim(),type.trim(),value.trim(),effect.trim()));
        });
        shuffle(this.decks[0]);
        shuffle(this.decks[1]);
        
        this.hands = [[],[]];
        for(let i = 0;i<5;i++){
            this.hands[0].push(this.decks[0].pop());
            this.hands[1].push(this.decks[1].pop());
        }

        this.points = [[0,0,0],[0,0,0]];
        this.currentEffect = "";
        this.turn = 1;
        this.lastPlays = [null,null];
    }
    playerChooseCard(playerNum, handIndex){//1 or 2, 1-5
        playerNum-=1;
        handIndex-=1;
        
        if(this.lastPlays[0]!=null&&this.lastPlays[1]!=null)
            this.lastPlays = [null,null];

        if(this.lastPlays[playerNum]!=null)
            throw Error(`Can't make another move! Already locked in your move for turn ${this.turn}`);

        this.lastPlays[playerNum] = this.hands[playerNum][handIndex];//choose this card now
        this.hands[playerNum].splice(handIndex,1);//remove card from hand

        if(this.lastPlays[0]!=null&&this.lastPlays[1]!=null)//both players have made a choice for the card
        {
            const winner = this.makeTurn();
            return {status:"complete", winner:winner, ...this.getState()};
        }
        else
            return {status:"waiting", ...this.getState()};

    }
    makeTurn(){
        this.turn+=1;//increment turn

        //draw a card from both
        if(this.decks[0].length()>0)
            this.hands[0].push(this.decks[0].pop());
        if(this.decks[1].length()>0)
            this.hands[1].push(this.decks[1].pop());


        const type1 = this.lastPlays[0].type;
        const type2 = this.lastPlays[1].type;
        const value1 = this.lastPlays[0].value;
        const value2 = this.lastPlays[1].value;    
        
        return this.resolveRound(type1,value1, type2, value2);
    }
    resolveRound(type1, value1, type2, value2) {
        const typeIndex = { alpha: 0, beta: 1, gamma: 2 };

        function beats(a, b) {
            return (
                (a === "alpha" && b === "beta") ||
                (a === "beta" && b === "gamma") ||
                (a === "gamma" && b === "alpha")
            );
        }

        function resolveNeutral(typeNeutral, opponentType) {
            return opponentType === "neutral" ? ["alpha", "beta", "gamma"][Math.floor(Math.random() * 3)] : opponentType;
        }

        // Handle neutral cards
        if (type1 === "neutral") type1 = resolveNeutral(type1, type2);
        if (type2 === "neutral") type2 = resolveNeutral(type2, type1);

        // Same type: compare values
        if (type1 === type2) {
            if (value1 > value2) {
                this.points[0][typeIndex[type1]] += 1;
                return 1;
            } else if (value2 > value1) {
                this.points[1][typeIndex[type2]] += 1;
                return 2;
            } else {
                return 0; // tie
            }
        }

        // Type1 wins
        if (beats(type1, type2)) {
            this.points[0][typeIndex[type1]] += 1;
            return 1;
        }

        // Type2 wins
        if (beats(type2, type1)) {
            this.points[1][typeIndex[type2]] += 1;
            return 2;
        }

        return 0; // fallback for unexpected cases
    }


    getState(){
        return {hand1:this.hands[0],
            hand2:this.hands[1],
            points: this.points, 
            currentEffect:this.currentEffect,
            turn:this.turn,
            lastPlays:this.lastPlays
        }
    }
    getWinner(){
        if((this.points[0][0]>0&&this.points[0][1]>0&&this.points[0][2]>0)||(this.points[0][0]>=3||this.points[0][1]>=3||this.points[0][2]>=3))
            return 1;
        else if((this.points[1][0]>0&&this.points[1][1]>0&&this.points[1][2]>0)||(this.points[1][0]>=3||this.points[1][1]>=3||this.points[1][2]>=3))
            return 2;
        else
            return 0;
    }
}
module.exports = {GameState};