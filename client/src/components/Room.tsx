import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { WebSocketHook } from 'react-use-websocket/dist/lib/types';
import Game from './Game';

type RoomProps = {
    username: string,
    roomCode: string,
    connection: WebSocketHook<any>,
}


export default function Room({username, roomCode, connection}:RoomProps) {
    const [username1, updateUsername1] = useState(username);
    const [username2, updateUsername2] = useState("");

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
        //Gross implementation of hand changes
        if(lastJsonMessage.hand1&&lastJsonMessage.hand1.length!=gamestate.hand.length){
            updateGamestate({
                turn: gamestate.turn,
                points: gamestate.points,
                hand: lastJsonMessage.hand1,
                currentEffect: gamestate.currentEffect,
                lastPlays: gamestate.lastPlays,
            });
        }
        else if(lastJsonMessage.hand2&&lastJsonMessage.hand2.length!=gamestate.hand.length){
            updateGamestate({
                turn: gamestate.turn,
                points: gamestate.points,
                hand: lastJsonMessage.hand2,
                currentEffect: gamestate.currentEffect,
                lastPlays: gamestate.lastPlays,
            });
        }

        if(lastJsonMessage.username1!=undefined&&lastJsonMessage.username1!=username1){
            updateUsername1(lastJsonMessage.username1);
        }
        if(lastJsonMessage.username2!=undefined&&lastJsonMessage.username2!=username2){
            updateUsername2(lastJsonMessage.username2);
        }
    }

    const makeMove = (handIndex:number)=>{
        if(handIndex<=0||handIndex>5)
            throw Error("Out of Bounds!");
        connection.sendJsonMessage({type:'makeMove', handIndex:handIndex});
    }

    const stateHTML =()=>{ 
        return (<>
        {(!username1||!username2) && <h1>Opponent Not in Game!</h1>}
        <h3>Turn {gamestate.turn}</h3>
        <p>Points for {username1}: {gamestate.points[0][0]} {gamestate.points[0][1]} {gamestate.points[0][2]}</p>
        <p>Points for {username2}: {gamestate.points[1][0]} {gamestate.points[1][1]} {gamestate.points[1][2]}</p>
        <p>Current Effect: {gamestate.currentEffect}</p>
    </>);}

    const handHTML = ()=>{return <>{gamestate.hand.map((card:any,index)=>(
        <button key={index} onClick={()=>makeMove(index+1)}>{card.name} {card.type} {card.value} {card.specialEffect}</button>
    ))}</>}

    return <Game username1={username1} username2={username2} roomCode={roomCode} gamestate={gamestate}></Game>;

    // return (
    //     <>
    //         <h1>
    //             Welcome to room {roomCode}, {username} 
    //         </h1>
    //         {stateHTML()}
    //         {handHTML()}
    //     </>
    // );
}
