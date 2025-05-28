import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { WebSocketHook } from 'react-use-websocket/dist/lib/types';

type RoomProps = {
    username: string,
    roomCode: string,
    connection: WebSocketHook<any>,
}

export default function Room({username, roomCode, connection}:RoomProps) {

    return (
        <h1>
            Welcome to room {roomCode}, {username} 
        </h1>
    );
}
