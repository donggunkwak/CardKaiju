const {GameState} = require('./GameState.js')
class Room{
    constructor(id){
        this.id = id;
        this.p1 = null;
        this.p2 = null;
        this.gameState = new GameState();//not implemented yet
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