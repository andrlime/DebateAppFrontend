import axios from "axios";
import { FunctionComponent, useEffect, useState, useRef } from "react";

export const JudgeExportArea: FunctionComponent = () => {
    const [email, setEmail] = useState("");
    const [emailV, setEmailV] = useState("");
    const [fail, setFail] = useState(false);

    const backendUrl = useRef("");
    const apiKey = useRef("");

    useEffect(() => {
      if(email!=emailV && email!="") setFail(true);
      else if(email==emailV && email!="") setFail(false);
    },[email, emailV])

    const push = () => {
      if(email.match((/((\w|[-]|[.])+[@]\w+([.]\w+)+)/g)) && email==emailV) {
        setFail(false);

        axios.get("/api/getkey").then((res)=> {
          backendUrl.current = res.data.backendUrl || "";
          apiKey.current = res.data.apiKey || "";

          axios.post(`https://${backendUrl.current}/get/alleval`, {email: email, apikey: apiKey.current}).then((_) => {
            setFail(false);
            setEmail("");
            setEmailV("");
          })
        });
      } else {
        setFail(true);
      }
    }
  
    return (<div>
      <div>Email for Export: <input style={{border: fail ? "2px solid red" : "2px solid black"}} type="text" value={email} onChange={(e) => {let em = (e.target.value); setEmail(em);}}/></div>
      <div>Verify Email for Export: <input style={{border: fail ? "2px solid red" : "2px solid black"}} type="text" value={emailV} onChange={(e) => {let em = (e.target.value); setEmailV(em);}}/></div>
      <div>Export: <button onClick={(_) => push()}>Download</button></div>
    </div>)
  }