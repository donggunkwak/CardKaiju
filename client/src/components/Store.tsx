import { create } from 'zustand'

interface State{
    username: string,
    uid: string,
    changeUsername: (username:string)=>void,
    changeUID: (uid:string)=>void
}

export const useUserStore = create<State>((set) => ({
  username: "",
  uid: "",
  changeUsername: (username:string) => set(({ username: username})),
  changeUID: (uid:string) => set(({ uid: uid})),
}))