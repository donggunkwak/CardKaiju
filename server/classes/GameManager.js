const {Player} = require('./Player.js');
const {Room} = require('./Room.js');

const CODELENGTH = 6;

class GameManager{
    constructor(){
        this.rooms = {};
        this.players = {};
    }
    addPlayer(username, uuid,connection){
        this.players[uuid] = new Player(username, uuid, connection);
    }
    removePlayer(uuid){
        const player = this.players[uuid];
        if(player.roomCode!=null){
            const room = this.rooms[roomCode];
            room.removePlayer(player);
            if(room.isEmpty()){
                this.deleteRoom(roomCode);
            }
        }
        delete this.players[uuid];
    }
    createRoom(code=null){
        if(code==null){
            code = this.generate_unique_code();
        }
        if(code.length!=CODELENGTH){
            throw Error("Code needs to be length of 6!");
        }
        this.rooms[code] = new Room(code);
    }
    deleteRoom(code){
        const room = this.rooms[code];
        if(room==undefined){
            throw Error("Room not Found!");
        }
        delete this.rooms[code];
    }
    joinRoom(uuid, code){
        if(!Object.keys(this.players).includes(uuid))
            throw Error(`Player with uid ${uuid} not found!`);
        

        if(!Object.keys(this.rooms).includes(code))//create room if it doesn't exist
            this.createRoom(code);
        
        const player =this.players[uuid];
        const room = this.room[code];
        if(room.hasSpace()){
            room.addPlayer(player);//try to add player to the room first to see if it works!
            player.roomCode = code;
        }
    }
    leaveRoom(uuid){
        if(!Object.keys(this.players).includes(uuid))
            throw Error(`Player with uid ${uuid} not found!`);

        const player =this.players[uuid];
        if(player.roomCode==null)
            throw Error("Player is not in a room!");
        const room = this.rooms[player.roomCode];
        room.removePlayer(player);
        player.roomCode=null;
    }

    handleMessage(uuid, message){
        if(!Object.keys(this.players).includes(uuid))
            throw Error(`Player with uid ${uuid} not found!`);


        const playerConnection = this.players[uuid].connection;
        console.log(uuid,message.toString());

        message = JSON.parse(message.toString());

        console.log(uuid,message, message.type);
        switch(message.type){
            case 'joinRoom':
                try{
                    var code = message.roomCode;
                    if(!code)
                        code = null;
                    this.joinRoom(uuid,code);
                }
                catch(e){
                    console.log(e);
                    playerConnection.send(JSON.stringify({ type: 'error', message: e.toString() }));
                }
                break;
            case 'leaveRoom':
                try{
                    this.leaveRoom(uuid);
                }
                catch(e){
                    playerConnection.send(JSON.stringify({ type: 'error', message: e.toString() }));
                }
                break;
        }
        console.log(`Rooms: ${this.rooms}`);
        console.log(`Players: ${this.players}`);
    }

    generate_unique_code(){
        for(var i=0;i<100;i++){//Try 100 times
            var code = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for ( var i = 0; i < CODELENGTH; i++ ) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            if(!Object.keys(this.rooms).includes(code))
            {
                return code;
            }
        }
        throw Error("Could not generate a unique code for some reason, try again");
    }
    

}

module.exports = {GameManager};