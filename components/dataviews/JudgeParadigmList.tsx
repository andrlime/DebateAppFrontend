import { FC, useState } from "react";
import Judge from "../../types/Judge";
import styles from '../../styles/Q.module.css';
import MarkdownViewer from "./MarkdownViewer";
import { DEFAULT_OPTIONS } from "../../types/Options";

type Props = {
    data: Judge[];
    auth: boolean;
    filter: string;
    showEditBox: Function
}

export const JudgeParadigmList: FC<Props> = ({data, auth, filter, showEditBox}) => {
    const DATA = (data.filter(element => (element.email.toLowerCase().includes(filter) || element.name.toLowerCase().includes(filter)) && (auth || element.paradigm)));
    return (
        <div style={{display: "flex", flexDirection: "column"}}>{
            DATA.sort((a,b) => a.name.localeCompare(b.name)).map(e => (
                <SingleParadigm j={e} key={e._id.toString()} a={auth} showEditBox={showEditBox}/>
            ))
        }</div>
    );
}

const SingleParadigm: FC<{j: Judge, key: any, a: boolean, showEditBox: Function}> = ({j, key, a, showEditBox}) => {
    let OPTIONS = j.options ? j.options : DEFAULT_OPTIONS;

    return (
        <div key={key+"PARADIGM"} className={styles.paradigmcard + " " + styles.markdownBox}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}><h1>{j.name}</h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {a ? <button onClick={() => {
                showEditBox(j._id);
            }} style={{padding: "0.5rem 1rem 0.5rem 1rem", background: "#0e397a", border: "none", borderRadius: "3rem", color: "white", fontWeight: 900}}>Edit</button> : ""}</div>
            <div className={styles.markdownBox} style={{flexDirection: "row", display: "flex", justifyContent: "space-between"}}>
                
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <h2>Nationality</h2>
                    <p>{OPTIONS.nationality || "not specified"}</p>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <h2>Gender</h2>
                    <p>{OPTIONS.gender == "O" ? "Non Binary" : OPTIONS.gender || "not specified"}</p>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <h2>Age</h2>
                    <p>{OPTIONS.age || "not specified"}</p>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <h2>University</h2>
                    <p>{OPTIONS.university || "not specified"}</p>
                </div>
                
            </div>
            <MarkdownViewer markdown={j.paradigm}/>
        </div>
    );
}