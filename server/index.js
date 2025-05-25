const http = require('http')
const {WebSocketServer} = require('ws')
const url = require('url')
const uuidv4 = require('uuid').v4
const {GameManager} = require('./classes/GameManager.js');



const server = http.createServer() 

const wsServer = new WebSocketServer({server : server})

const port = 8000



// const brodcast = ()=>{
//     Object.keys(connections).forEach(uuid => {
//         const connection = connections[uuid]
//         const message = JSON.stringify(users)
//         connection.send(message)
//     });
// }

const gameManager = new GameManager();

wsServer.on("connection", (connection,request)=>{
    //ws://127.0.0.1:8000?username=Kevin

    const {username} = url.parse(request.url, true).query
    const uuid = uuidv4()
    console.log(`${username} connected with userid ${uuid}`);

    gameManager.addPlayer(username,uuid,connection);

    connection.on("message", (message)=>{
        gameManager.handleMessage(uuid,message);
    });
    connection.on("close",()=> gameManager.removePlayer(uuid));
})

server.listen(port, ()=>{
    console.log(`Websock server is running on port ${port}`)
})