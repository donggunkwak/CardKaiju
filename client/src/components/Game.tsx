import { useEffect, useRef   } from "react";
import { Card } from "../graphics/Card";
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
    gamestate:GameState
}   


export default function Game({username1, username2, gamestate}: GameProps){
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

        const tempCard:Card = new Card(
            window.innerWidth/2,
            window.innerHeight/2,
            window.innerWidth/8,
            "King K. Juul", "gamma", 
            10, 
            "Alpha Cards are now Gamma");
        
        const animate = ()=>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            tempCard.draw(ctx);
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        window.addEventListener('resize',()=>{
            const newWindowSize = { width: window.innerWidth, height: window.innerHeight };
            tempCard.resize(previousWindowSize, newWindowSize);
            resizeCanvas();

            previousWindowSize = newWindowSize;
        });
        window.addEventListener('mousemove', (event)=>{
            const x = event.clientX;
            const y = event.clientY;
            tempCard.updateMouseOver(x,y);
        });
        window.addEventListener('click', ()=>{

        });

    }, []);
    return (
        <canvas className='border-black border-4 w-screen h-screen' ref={canvasRef}></canvas>
    )
}