import { useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { useUserStore } from '@/src/components/Store';

type HomeProps = {
    username: string
}

function setUsernameAndUUID(username:string, uid:string){
    useUserStore((state)=>state.changeUsername(username));
    useUserStore((state)=>state.changeUID(uid));
}

export function Home({username}:HomeProps) {
    console.log('hi')

    const {lastJsonMessage} = useWebSocket<any>(process.env.NEXT_PUBLIC_WS_URL!,{
        share:true,
        queryParams:{ username:username }
    })
    var uid:string = "";
    if (lastJsonMessage) {
        uid =  lastJsonMessage.uuid;
    }
    console.log(username, uid)
    // setUsernameAndUUID(username,uid);


    return (<h1>Welcome {username}</h1>)
}