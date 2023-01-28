/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Q.module.css';
import axios from 'axios';
import Judge from '../types/Judge';
import NavigationBar from '../components/nav/NavigationMenu';
import { useRouter } from 'next/router';
import { JudgeParadigmList } from '../components/dataviews/JudgeParadigmList';
import { ParadigmEditor } from '../components/dataviews/ParadigmEditor';

const Home: NextPage = () => {
  const [auth, setAuth] = useState(false);

  const { query } = useRouter();
  const backendUrl = useRef("");
  const apiKey = useRef("");
  const router = useRouter();

  const [filter, setFilter] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [judges, setJudges] = useState<Judge[]>([]);

  const [active, setActive] = useState(false);
  const [activeid, setActiveID] = useState("");

  useEffect(() => {
    if(query.auth == 'true') {
      setAuth(true);
    } else {
      setAuth(false);
    }

    axios.get("/api/getkey").then((res)=> {
      backendUrl.current = res.data.backendUrl || "localhost:9093";
      apiKey.current = res.data.apiKey || "";

      axios.get(`https://${backendUrl.current}/get/alljudges/${apiKey.current}`).then((res) => {
        console.log("Got them");
        if(res.data != null) {
          let j: Judge[] = res.data.result;
          setJudges(j);
          setLoaded(true);
        }
      })
    })
  },[query.auth, router]);
  
  const showEditBox = (id: string) => {
    setActiveID(id);
    setActive(true);
  }

  const callback = (id: string, val: string) => {
    for(let j of judges) {
      if(j._id.toString() == id) {
        j.paradigm = val;
      }
    }
    setActive(false);
  }

  return (
    <div className={styles.everything}>
      <Head>
        <title>NHSDLC Judge Paradigms</title>
        <link rel="icon" type="image/x-icon" href="/icon.png"/>
      </Head>
      <NavigationBar pageIndex={5}/>
      <div className={styles.content}>
        <div className={styles.heading}>NHSDLC Judge Paradigms</div>
        <div className={styles.form} style={{paddingLeft: "0rem", width: "100%"}}>

          {!active ? (<div className={styles.sublabel} style={{paddingLeft: "0.5rem", display: "flex", width: "100%"}} id={styles.customlabel}>
            <input placeholder='filter judges by name or email' value={filter} onChange={(e)=>setFilter(e.target.value)} type={'text'} style={{width: "70%", minWidth: "450px", padding: "0.2rem", margin: "0.25rem"}}></input>
            <span style={{cursor: "pointer"}} onClick={!auth ? (() => router.push(`/auth?path=paradigms`)) : (() => {})}>{auth ? "" : "Login"}</span>
          </div>) : ""}

          {!active ? loaded ? (<JudgeParadigmList data={judges} auth={auth} filter={filter} showEditBox={showEditBox}/>) : "Loading..." : ""}
          
        </div>

        {loaded&&active ? <>
        <ParadigmEditor id={activeid} callback={callback}/></> : ""}
      </div>
    </div>
  );
};

export default Home;