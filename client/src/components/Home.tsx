import { useState, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { useUserStore } from '@/src/components/Store';

type HomeProps = {
    username: string
}
function setUsernameAndUID(username: string, uid: string) {
    const store = useUserStore.getState();
    store.changeUsername(username);
    store.changeUID(uid);
    
}
function logout(){
    const store = useUserStore.getState();
    store.changeUsername("");
    store.changeUID("");
}

export function Home({username}:HomeProps) {


    const {lastJsonMessage} = useWebSocket<any>(process.env.NEXT_PUBLIC_WS_URL!,{
        share:true,
        queryParams:{ username:username }
    })

    var uid = lastJsonMessage?.uuid;
    useEffect(() => {
        if (lastJsonMessage?.uuid) {
            setUsernameAndUID(username, uid);
        }
    }, [uid]);

    
    const logoutButton = <button></button>
    
    return (
    <div>
        <h1>Welcome {username}</h1>
        <button onClick={logout}>Logout</button>
        </div>
    )
}