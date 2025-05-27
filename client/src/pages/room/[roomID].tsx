import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useUserStore } from '@/src/components/Store';

export default function Room() {
    const username = useUserStore((state) => state.username);
    const uid = useUserStore((state) => state.uid);
    

    // const { lastJsonMessage } = useWebSocket<any>(process.env.NEXT_PUBLIC_WS_URL!, {
    //     share: true,
    //     queryParams: { username },
    //     shouldReconnect: () => true,
    // });

    return (
        <h1>
            Welcome to the room, {username} ({uid})
        </h1>
    );
}
