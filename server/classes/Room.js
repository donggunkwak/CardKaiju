class Room{
    constructor(id){
        this.id = id;
        this.players = [];
        this.gameState = null;//not implemented yet
    }
    addPlayer(player){
        if(this.players.length<2){
            this.players.push(player);
        }
        else{
            throw Error('Room full');
        }
    }
    removePlayer(player){
        const index = this.players.indexOf(player);
        if(index<0){
            throw Error(`Can't find player ${JSON.stringify(player)}`);
        }
        this.players.splice(index,1);
    }
    hasSpace(){
        return this.players.length<2;
    }
    isEmpty(){
        return this.players.length==0;
    }
}

module.exports = {Room};