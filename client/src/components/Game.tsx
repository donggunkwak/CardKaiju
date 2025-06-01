import { useEffect, useRef   } from "react";
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

class Card{
    x:number;
    y:number;
    name:string;
    type:string;
    value:number;
    specialEffect:string;
    scale:number = 1;

    constructor(x:number, y:number, name:string, type:string, value:number, specialEffect:string) {
        this.x = x;
        this.y = y;
        this.name = name;
        if(type=="alpha"){
            this.type = "\u03B1";
        }
        else if(type=="beta"){
            this.type = "\u03B2";
        }
        else if(type=="gamma"){
            this.type = "\u03B3";
        }
        else{
            this.type = "\u03B7";
        }
        this.value = value;
        this.specialEffect = specialEffect;
    }
    draw(ctx:CanvasRenderingContext2D){
        const cardTemplate = new Image();
        cardTemplate.src = "/images/CardTemplate.png";
        const width = window.innerWidth/16 *this.scale;
        const height = window.innerWidth/12 * this.scale;
        ctx.drawImage(cardTemplate, this.x,this.y, width, height);
    }
    
}


export default function Game({username1, username2, gamestate}: GameProps){
    const canvasRef =  useRef<HTMLCanvasElement>(null);
    
    useEffect(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const tempCard:Card = new Card(window.innerWidth/2, window.innerHeight/2, "King K. Juul", "alpha", 8, "");

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        
        const animate = ()=>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            tempCard.draw(ctx);
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        window.addEventListener('resize',()=>{

        });
        window.addEventListener('mouseover', ()=>{

        });
        window.addEventListener('click', ()=>{

        });

    }, []);
    return (
        <canvas className='border-black border-4 w-screen h-screen' ref={canvasRef}></canvas>
    )
}