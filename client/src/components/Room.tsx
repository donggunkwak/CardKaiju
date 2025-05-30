import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { WebSocketHook } from 'react-use-websocket/dist/lib/types';

type RoomProps = {
    username: string,
    roomCode: string,
    connection: WebSocketHook<any>,
}


export default function Room({username, roomCode, connection}:RoomProps) {


    const [gamestate, updateGamestate] = useState({
        turn: 0,
        points: [[0,0,0],[0,0,0]],
        hand: [],
        currentEffect: "",
        lastPlays: [null,null],
    });

    const [playerNum, updatePlayerNum] = useState(0);

    const lastJsonMessage = connection.lastJsonMessage;
    if(lastJsonMessage){
        if(lastJsonMessage.turn&&lastJsonMessage.turn>gamestate.turn){
            const newTurn = lastJsonMessage.turn;
            const newEffect = lastJsonMessage.currentEffect;
            const newPoints = lastJsonMessage.points;
            const newLastPlays = lastJsonMessage.lastPlays;

            const newState = {
                turn: newTurn,
                points: newPoints,
                hand: [],
                currentEffect: newEffect,
                lastPlays: newLastPlays,
            }

            if(lastJsonMessage.hand1){
                updatePlayerNum(1);
                newState.hand = lastJsonMessage.hand1;
            }
            else if(lastJsonMessage.hand2){
                updatePlayerNum(2);
                newState.hand = lastJsonMessage.hand2;
            }
            updateGamestate(newState);
        }
    }

    const stateHTML = (<>
        <h3>Turn {gamestate.turn}</h3>
        <p>Points for player 1: {gamestate.points[0][0]} {gamestate.points[0][1]} {gamestate.points[0][2]}</p>
        <p>Points for player 2: {gamestate.points[1][0]} {gamestate.points[1][1]} {gamestate.points[1][2]}</p>
        <p>Current Effect: {gamestate.currentEffect}</p>
    </>);

    const handHTML = <>{gamestate.hand.map((item,index)=>(
        <p key={index}>{item}</p>
    ))}</>


    return (
        <>
            <h1>
                Welcome to room {roomCode}, {username} 
            </h1>
            {stateHTML}
            {handHTML}
        </>
    );
}
