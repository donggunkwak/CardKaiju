import { useEffect, useRef   } from "react";
import { Hand } from "../graphics/Hand";
import { Header } from "../graphics/GameHeader";
import { ImageHandler } from "../graphics/ImageHandler";
import { Exit } from "../graphics/Exit";
import { CardDrop } from "../graphics/CardDrop";
import { WinGraphic } from "../graphics/WinGraphic";
import { LastPlay } from "../graphics/LastPlay";
type GameState = {
  turn: number;
  points: number[][];
  hand: any[];
  currentEffect: string;
  lastPlays: (any | null)[];
  roundWinner:number;
};

type GameProps = {
    username1: string,
    username2: string,
    roomCode:string,
    gamestate:GameState,
    playerNum:number,
    winner:number,
    onExit: ()=>void,
    onMove: (index:number)=>void,
    onRestart: ()=>void,
}   


export default function Game({username1, username2, roomCode, gamestate, playerNum, winner, onExit, onMove, onRestart}: GameProps){
    const canvasRef =  useRef<HTMLCanvasElement>(null);
    
    useEffect(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();

        let previousWindowSize = { width: window.innerWidth, height: window.innerHeight };

        const hand = new Hand(window.innerWidth/2, window.innerHeight*0.9, window.innerWidth*3/4, gamestate.hand);


        const header = playerNum==1||playerNum==0?new Header(username1+"(You)",username2,roomCode,gamestate.points):new Header(username1,username2+"(You)",roomCode,gamestate.points);
        const exit = new Exit(window.innerWidth*0.95, 0,Math.min(window.innerHeight*0.1,window.innerWidth*0.05))
        const cardDrop = new CardDrop(window.innerWidth/2,window.innerHeight*0.35,window.innerWidth*0.3, window.innerHeight*0.3);
        const winGraphic = new WinGraphic(window.innerWidth/2,window.innerHeight*0.4,window.innerWidth*0.4, window.innerHeight*0.2);

        console.log(gamestate.lastPlays);
        const lastPlay = new LastPlay(window.innerWidth/2,window.innerHeight*0.4,window.innerWidth*0.35,window.innerWidth*0.15,
            gamestate.lastPlays,playerNum, gamestate.roundWinner);

        header.draw(ctx);
        
        const animate = ()=>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hand.draw(ctx);
            header.draw(ctx);
            exit.draw(ctx);
            if(hand.clicked){
                cardDrop.draw(ctx);
            }
            if(winner==1)
                winGraphic.draw(ctx,username1);
            else if(winner==2)
                winGraphic.draw(ctx,username2);
            
            lastPlay.draw(ctx);
            setTimeout(()=>{}, 10);
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);


        const handleResize = ()=>{
            const newWindowSize = { width: window.innerWidth, height: window.innerHeight };
            hand.resize(previousWindowSize, newWindowSize);
            exit.resize(previousWindowSize,newWindowSize);
            cardDrop.resize(previousWindowSize,newWindowSize);
            winGraphic.resize(previousWindowSize,newWindowSize);
            lastPlay.resize(previousWindowSize,newWindowSize);
            resizeCanvas();

            previousWindowSize = newWindowSize;
        };

        const handleMouseMove = (event:MouseEvent)=>{
            const x = event.clientX;
            const y = event.clientY;
            hand.updateMouseOver(x,y);
        };

        const handleMouseDown = (event:MouseEvent)=>{
            const x = event.clientX;
            const y = event.clientY;
            hand.onClick(x,y);
            if(exit.mouseIn(x,y)){
                onExit();
            }
            if(winner&&winGraphic.mouseIn(x,y)){
                onRestart();
            }
        }

        const handleMouseUp = (event:MouseEvent)=>{
            const x = event.clientX;
            const y = event.clientY;
            if(hand.clicked &&hand.hovered!=-1&& cardDrop.mouseIn(x,y)){
                onMove(hand.hovered+1);
            }
            hand.onRelease();
        };

        window.addEventListener('resize',handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup',handleMouseUp)
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };

    }, [username1, username1, roomCode, gamestate, playerNum, winner]);
    return (
        <canvas className='border-black border-4 w-screen h-screen' ref={canvasRef}></canvas>
    )
}