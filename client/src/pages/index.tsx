import Image from "next/image";
import { Login } from "../components/Login";
import { Home } from "../components/Home";
import { useUserStore } from '@/src/components/Store';
import { useState } from "react";


export default function App() {
    // const username = useUserStore((state) => state.username);
    // const setUsername = useUserStore((state)=>state.changeUsername);
    const [username, setUsername] = useState("");
    
    if(username){
        return (<Home username={username} onLogout={()=>setUsername("")}/>);
    }else{
        return (<Login onSubmit={setUsername}/>);
    }
    
}
