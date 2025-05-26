import { useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { useUserStore } from '@/src/components/Store';


export default function Room() {
    let username:string = useUserStore((state)=>state.username);
    let uid:string = useUserStore((state)=>state.uid);
    const {lastJsonMessage} = useWebSocket<any>(process.env.NEXT_PUBLIC_WS_URL!,{
        share:true,
        queryParams:{ username:username }
    })
    

    return (<h1>{username} {uid}</h1>)
}