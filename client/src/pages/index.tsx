import Image from "next/image";
import { Login } from "../components/Login";
import { Home } from "../components/Home";
import { useState} from "react";


export default function App() {
    const [username, setUsername] = useState("");
    
    if(username){
        return (<Home username={username}/>);
    }else{
        return (<Login onSubmit={setUsername}/>);
    }
    
}
