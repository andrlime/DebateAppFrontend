import { FC, useState } from "react";
import Judge from "../../types/Judge";
import styles from '../../styles/Q.module.css';
import MarkdownViewer from "./MarkdownViewer";

type Props = {
    data: Judge[];
    auth: boolean;
    filter: string;
    showEditBox: Function
}

export const JudgeParadigmList: FC<Props> = ({data, auth, filter, showEditBox}) => {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>{
            (data.filter(element => (element.email.toLowerCase().includes(filter) || element.name.toLowerCase().includes(filter)) && (auth || element.paradigm.length > 0))).map(e => (
                <SingleParadigm j={e} key={e._id.toString()} a={auth} showEditBox={showEditBox}/>
            ))
        }</div>
    );
}

const SingleParadigm: FC<{j: Judge, key: any, a: boolean, showEditBox: Function}> = ({j, key, a, showEditBox}) => {
    return (
        <div key={key+"PARADIGM"} className={styles.paradigmcard + " " + styles.markdownBox}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}><h1>{j.name}</h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {a ? <button onClick={() => {
                showEditBox(j._id);
            }} style={{padding: "0.5rem 1rem 0.5rem 1rem", background: "#0e397a", border: "none", borderRadius: "3rem", color: "white", fontWeight: 900}}>Edit</button> : ""}</div>
            <MarkdownViewer markdown={j.paradigm}/>
        </div>
    );
}