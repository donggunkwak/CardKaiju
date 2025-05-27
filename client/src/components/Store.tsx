import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State{
    username: string,
    uid: string,
    changeUsername: (username:string)=>void,
    changeUID: (uid:string)=>void
}

export const useUserStore = create<State>()(persist((set) => ({
  username: "",
  uid: "",
  changeUsername: (username:string) => set(({ username: username})),
  changeUID: (uid:string) => set(({ uid: uid})),
}),
{
  name:'user-info'
}))