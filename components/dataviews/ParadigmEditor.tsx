import { FC, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Q.module.css';
import Judge from '../../types/Judge';

type Props = {id: string, callback: Function};

export const ParadigmEditor: FC<Props> = ({id, callback}) => {
    const [val, setVal] = useState("");
    const [name, setName] = useState("");

    const backendUrl = useRef("");
    const apiKey = useRef("");

    const [u, setU] = useState("");
    const [g, setG] = useState("");
    const [a, setA] = useState(0);
    const [n, setN] = useState("");

    useEffect(() => {
        axios.get("/api/getkey").then((res)=> {
            let beUrl = res.data.backendUrl || "localhost:9093";
            let apk = res.data.apiKey || "";
            backendUrl.current = beUrl;
            apiKey.current = apk;

            axios.get(`https://${beUrl}/get/judge/${apk}/${id}`).then((res) => {
            let j: Judge = (res.data.result);
            setVal(j.paradigm);
            setName(j.name);

            setU(j.options?.university || "");
            setG(j.options?.gender || "");
            setA(j.options?.age || 0);
            setN(j.options?.nationality || "");
        })
      });
    },[id]);

    return (
        <div>
            <div className={styles.markdownBox} style={{maxWidth: "1200px"}}>
                <h1>Editing Paradigm for Judge {name || "[loading...]"}</h1>
                <p>Instructions: This editor uses markdown. If you know how to write Markdown, great. If you don&#39;t, use this website <a href="https://word2md.com/" style={{textDecoration: "underline"}}>https://word2md.com/</a> and copy/paste the LEFT column into this box.</p>
            </div>
            <br/>
            <textarea style={{border: "0.08rem solid #0e397a", borderRadius: "2rem", padding: "1rem", width: "100%", height: "fit-content", minHeight: "200px"}} value={val} onChange={(e) => {
                setVal(e.target.value);
                let s = e.target.value;
            }}/>

            <div className={styles.markdownBox} style={{maxWidth: "1200px"}}>
                <h1>Set Misc Details</h1>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "200px 200px", gridRow: "auto auto", gridColumnGap: "20px", gridRowGap: "20px"}}>
                
                <div style={{display: "flex", flexDirection: "column"}}>University: <input value={u} onChange={(e) => setU(e.target.value)} type="text" style={{backgroundColor: "white", padding: "0.5rem", borderRadius: "2rem", border: `1px solid #0e397a`}}></input></div>
                
                <div style={{display: "flex", flexDirection: "column"}}>Age: <input value={a} onChange={(e) => setA(parseInt(e.target.value))} type="number" style={{backgroundColor: "white", padding: "0.5rem", borderRadius: "2rem", border: `1px solid #0e397a`}}></input></div>
                
                <div style={{display: "flex", flexDirection: "column"}}>Nationality: <input value={n} onChange={(e) => setN(e.target.value)} style={{backgroundColor: "white", padding: "0.5rem", borderRadius: "2rem", border: `1px solid #0e397a`}}></input></div>
                
                <div style={{display: "flex", flexDirection: "column"}}>Gender: <select value={g} onChange={(e) => setG(e.target.value)} style={{backgroundColor: "white", padding: "0.5rem", borderRadius: "2rem", border: `1px solid #0e397a`}}>
                    
                    <option value={"Male"}>Male</option>
                    <option value={"Female"}>Female</option>
                    <option value={"Non-Binary"}>Non-Binary</option>
                    <option value={"Other"}>Other</option>
                    
                    </select></div>
            
            </div>
            <br/>

            <button style={{cursor: "pointer", padding: "0.5rem 1rem 0.5rem 1rem", background: "#0e397a", border: "none", borderRadius: "3rem", color: "white", fontWeight: 900}} onClick={() => {
                axios.post(`https://${backendUrl.current}/update/paradigm/${apiKey.current}/${id}`, {paradigm: val, options: {nationality: n, gender: g, age: a, university: u}}).then((_) => {
                    callback(id, val, {nationality: n, gender: g, age: a, university: u});
                });
            }}>Done</button>

        </div>
    );
}