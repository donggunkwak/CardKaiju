import { useState, useEffect, useRef } from 'react'
import useWebSocket from 'react-use-websocket'
import Room from './Room';
import { connect } from 'http2';

type HomeProps = {
    username: string,
    onLogout: ()=>void,
}

export function Home({username, onLogout}:HomeProps) {
    const [roomText, changeRoomText] = useState("");
    const [currentRoom, updateCurrentRoom] = useState("");

    const connection = useWebSocket<any>(process.env.NEXT_PUBLIC_WS_URL!,{
        share:true,
        queryParams:{ username:username }
    })
    const lastJsonMessage = connection.lastJsonMessage;

    useEffect(()=>{
        if(lastJsonMessage){
            if(lastJsonMessage.room&&lastJsonMessage.room!=currentRoom){
                const room = connection.lastJsonMessage.room;
                updateCurrentRoom(room);
            }
            else if(lastJsonMessage.type=="error"){
                window.alert(lastJsonMessage.message);
                
            }
        }
    },[lastJsonMessage])

    const exitRoom = ()=>{
        connection.sendJsonMessage({type:'leaveRoom'});
        updateCurrentRoom("");
        changeRoomText("");
    }


    if(currentRoom==""){
        return (
        <div>
            <h1>Welcome {username}</h1>
            <button onClick={onLogout}>Logout</button>
            <form onSubmit={e => {
                    e.preventDefault()
                    connection.sendJsonMessage({type:'joinRoom', roomCode:roomText});
                }}>
                    <input 
                        type="text" 
                        value={roomText} 
                        placeholder="Enter Room ID"
                        onChange={e => changeRoomText(e.target.value)} />
                    <input type="submit" />
                </form>
        </div>
        )
    }
    else{
        return <Room username={username} roomCode={currentRoom}  connection={connection} onExit={exitRoom}/>;
    }
}