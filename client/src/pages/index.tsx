import Image from "next/image";
import { Login } from "../components/Login";
import { Home } from "../components/Home";
import { useUserStore } from '@/src/components/Store';



export default function App() {
    const username = useUserStore((state) => state.username);
    const setUsername = useUserStore((state)=>state.changeUsername);
    
    if(username){
        return (<Home username={username}/>);
    }else{
        return (<Login onSubmit={setUsername}/>);
    }
    
}
