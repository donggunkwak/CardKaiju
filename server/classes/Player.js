class Player{
    constructor(username, uuid, connection){
        this.username = username;
        this.uuid = uuid;
        this.connection = connection;
        this.roomCode = null;
    }
    send(message){
        this.connection.send(message);
    }
}
module.exports = {Player};