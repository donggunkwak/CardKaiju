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

    return (
        <canvas className='border-black border-4 w-screen h-screen' ></canvas>
    )
}