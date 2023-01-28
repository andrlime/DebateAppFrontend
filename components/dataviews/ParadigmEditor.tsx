import { FC, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Q.module.css';

type Props = {id: string, callback: Function};

export const ParadigmEditor: FC<Props> = ({id, callback}) => {
    const [val, setVal] = useState("");
    const [name, setName] = useState("");

    const backendUrl = useRef("");
    const apiKey = useRef("");

    useEffect(() => {
        axios.get("/api/getkey").then((res)=> {
            let beUrl = res.data.backendUrl || "localhost:9093";
            let apk = res.data.apiKey || "";
            backendUrl.current = beUrl;
            apiKey.current = apk;

            axios.get(`https://${beUrl}/get/judge/${apk}/${id}`).then((res) => {
            let j = (res.data.result);
            setVal(j.paradigm);
            setName(j.name);
        })
      });
    },[id]);

    return (
        <div>
            <div className={styles.markdownBox} style={{maxWidth: "1200px"}}>
                <h1>Editing Paradigm for Judge {name || "[loading...]"}</h1>
                <p>Instructions: This editor uses markdown. If you know how to write Markdown, great. If you don&#39;t, use this website <a href="https://pandao.github.io/editor.md/en.html" style={{textDecoration: "underline"}}>https://pandao.github.io/editor.md/en.html</a> and copy/paste the LEFT column into this box.</p>
            </div>
            <br/>
            <textarea style={{border: "0.08rem solid #0e397a", borderRadius: "2rem", padding: "1rem", width: "100%", height: "fit-content", minHeight: "200px"}} value={val} onChange={(e) => {
                setVal(e.target.value);
                let s = e.target.value;
            }}/>

            <button style={{cursor: "pointer", padding: "0.5rem 1rem 0.5rem 1rem", background: "#0e397a", border: "none", borderRadius: "3rem", color: "white", fontWeight: 900}} onClick={() => {
                axios.post(`https://${backendUrl.current}/update/paradigm/${apiKey.current}/${id}`, {paradigm: val}).then((_) => {
                    callback(id, val);
                });
            }}>Done</button>

        </div>
    );
}