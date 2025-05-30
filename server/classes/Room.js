const {GameState} = require('./GameState.js')
class Room{
    constructor(id){
        this.id = id;
        this.p1 = null;
        this.p2 = null;
        this.gameState = new GameState();//not implemented yet
    }
    makeMove(playerID, handIndex){//1-2, 1-5
        const playerNum = this.getPlayerNum(playerID);
        let response = this.gameState.playerChooseCard(playerNum,handIndex);
        if(response.status=="complete"){
            // Send to p1 without hand2
            const {hand2, ...responseForP1} = response;
            this.p1.send(JSON.stringify(responseForP1));
            
            // Send to p2 without hand1
            const {hand1, ...responseForP2} = response;
            this.p2.send(JSON.stringify(responseForP2));
        }
    }
    getRoom(playerID){
        const p1 = this.p1==null?"":this.p1.username;
        const p2 = this.p2==null?"":this.p2.username;
        const response = {username1:p1, username2:p2, ...this.gameState.getState()};
        const playerNum = this.getPlayerNum(playerID);
        if(playerNum==1){
            const {hand2, ...responseForP1} = response;
            return responseForP1;
        }
        if(playerNum==2){
            const {hand1, ...responseForP2} = response;
            return responseForP2;
        }
    }
    getPlayerNum(playerID){
        if(this.p1.uuid==playerID)
            return 1;
        if(this.p2.uuid==playerID)
            return 2;
        throw Error("That player is not in the game!");
    }

    addPlayer(player){
        if(this.p1==null){
            this.p1 = player;
        }
        else if(this.p2==null){
            this.p2 = player;
        }
        else{
            throw Error('Room full');
        }
    }
    removePlayer(player){
        if(this.p1==player){
            this.p1=null;
        }
        else if(this.p2==player){
            this.p2=null;
        }
        else{
            throw Error('Player not found!');
        }
    }
    
    hasSpace(){
        return this.p1==null||this.p2==null;
    }
    isEmpty(){
        return this.p1==null&&this.p2==null;
    }
}

module.exports = {Room};