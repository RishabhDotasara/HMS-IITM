import {atom} from "recoil"

const toastAtom = atom({
    key:"toastAtom",
    default: {msg:"This is a message.",title:"This is a title."}
})

// const setMsg = (msg:string,title:string)=>{
//     useEffect()
// }

export default toastAtom