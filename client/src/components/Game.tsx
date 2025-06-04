import { useEffect, useRef   } from "react";
import { Hand } from "../graphics/Hand";
import { Header } from "../graphics/GameHeader";
import { ImageHandler } from "../graphics/ImageHandler";
import { Exit } from "../graphics/Exit";
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
    gamestate:GameState,
    onExit: ()=>void
}   


export default function Game({username1, username2, roomCode, gamestate, onExit}: GameProps){
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
        const exit = new Exit(window.innerWidth*0.95, 0,Math.min(window.innerHeight*0.1,window.innerWidth*0.05))
        header.draw(ctx);
        
        const animate = ()=>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hand.draw(ctx);
            header.draw(ctx);
            exit.draw(ctx);

            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        const handleResize = ()=>{
            const newWindowSize = { width: window.innerWidth, height: window.innerHeight };
            hand.resize(previousWindowSize, newWindowSize);
            exit.resize(previousWindowSize,newWindowSize);
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
                console.log("exit clicked");
                onExit();
            }
        }

        const handleMouseUp = ()=>{
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

    }, [username1, username1, roomCode, gamestate]);
    return (
        <canvas className='border-black border-4 w-screen h-screen' ref={canvasRef}></canvas>
    )
}