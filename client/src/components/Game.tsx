import { useEffect, useRef   } from "react";
import { Card } from "../graphics/Card";
import { Hand } from "../graphics/Hand";
import { Header } from "../graphics/GameHeader";
type GameState = {
  turn: number;
  points: number[][];
  hand: any[];
  currentEffect: string;
  lastPlays: (any | null)[];
};

type GameProps = {
    username1: string,
    username2: string,
    roomCode:string,
    gamestate:GameState
}   


export default function Game({username1, username2, roomCode, gamestate}: GameProps){
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
        const header = new Header(username1,username2,roomCode,gamestate.points);
        header.draw(ctx);
        
        const animate = ()=>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hand.draw(ctx);
            header.draw(ctx);
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        window.addEventListener('resize',()=>{
            const newWindowSize = { width: window.innerWidth, height: window.innerHeight };
            hand.resize(previousWindowSize, newWindowSize);
            resizeCanvas();
            previousWindowSize = newWindowSize;
        });
        window.addEventListener('mousemove', (event)=>{
            const x = event.clientX;
            const y = event.clientY;
            hand.updateMouseOver(x,y);
        });
        window.addEventListener('mousedown', (event)=>{
            const x = event.clientX;
            const y = event.clientY;
            hand.onClick(x,y);
        });
        window.addEventListener('mouseup',()=>{
            hand.onRelease();
        })

    }, [username1, username1, roomCode, gamestate]);
    return (
        <canvas className='border-black border-4 w-screen h-screen' ref={canvasRef}></canvas>
    )
}