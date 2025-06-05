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
            this.leaveRoom(uuid);
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
        code = code.toUpperCase();
        return this.rooms[code] = new Room(code);
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
        if(code!=null&&code.length!=CODELENGTH){
            throw Error("Code needs to be length of 6!");
        }
        var room = this.rooms[code];
        if(code==null||!Object.keys(this.rooms).includes(code))//create room if it doesn't exist
            room = this.createRoom(code);

        const player =this.players[uuid];
        if(room.hasSpace()){
            room.addPlayer(player);//try to add player to the room first to see if it works!
            player.roomCode = room.id;
        }
        else{
            throw Error("This room is full!");
        }
    }
    leaveRoom(uuid){
        if(!Object.keys(this.players).includes(uuid))
            throw Error(`Player with uid ${uuid} not found!`);

        const player =this.players[uuid];
        const roomCode = player.roomCode;

        if(roomCode==null)
            throw Error("Player is not in a room!");
        const room = this.rooms[roomCode];
        room.removePlayer(player);
        player.roomCode=null;
        if(room.p1)
            room.p1.send(JSON.stringify(room.getRoom(room.p1.uuid)))
        if(room.p2)
            room.p2.send(JSON.stringify(room.getRoom(room.p2.uuid)))
        if(room.isEmpty())
            this.deleteRoom(roomCode);
        
    }

    handleMessage(uuid, message){
        if(!Object.keys(this.players).includes(uuid))
            throw Error(`Player with uid ${uuid} not found!`);

        const player = this.players[uuid];
        const playerConnection = player.connection;
        console.log(player.username, uuid,message.toString());

        message = JSON.parse(message.toString());

        switch(message.type){
            case 'joinRoom':
                try{
                    var code = null;
                    if(message.roomCode!="")
                        code = message.roomCode.toUpperCase();
                    this.joinRoom(uuid,code);
                    const room = this.rooms[player.roomCode];
                    playerConnection.send(JSON.stringify({ type: 'message', message: `Succesfully joined room ${player.roomCode}`, room:player.roomCode}));

                    
                    if(!room.hasSpace()){//in case room is filled, send the gamestate
                        room.p1.send(JSON.stringify(room.getRoom(room.p1.uuid)));
                        room.p2.send(JSON.stringify(room.getRoom(room.p2.uuid)));
                    }
                    
                }
                catch(e){
                    console.log(e);
                    playerConnection.send(JSON.stringify({ type: 'error', message: e.toString() }));
                }
                break;
            case 'leaveRoom':
                try{
                    this.leaveRoom(uuid);
                    playerConnection.send(JSON.stringify({ type: 'message', message: `Succesfully left room` }));
                }
                catch(e){
                    console.log(e);
                    playerConnection.send(JSON.stringify({ type: 'error', message: e.toString() }));
                }
                break;
            case 'makeMove':
                try{
                    const handIndex = message.handIndex;
                    if(handIndex==undefined)
                        throw Error("Need to have handIndex in message sent");
                    const roomCode = player.roomCode;
                    const room = this.rooms[roomCode];
                    room.makeMove(uuid,handIndex);
                }
                catch(e){
                    console.log(e);
                    playerConnection.send(JSON.stringify({ type: 'error', message: e.toString() }));
                }
        }
        for(const roomCode in this.rooms){
            const p1Username = this.rooms[roomCode].p1?this.rooms[roomCode].p1.username:null;
            const p2Username = this.rooms[roomCode].p2?this.rooms[roomCode].p2.username:null;
            console.log(roomCode, p1Username,p2Username);
        }
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