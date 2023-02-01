/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import React, { useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Q.module.css';
import NavigationBar, { ToolList } from '../components/nav/NavigationMenu';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const [authState, setAuthState] = React.useState(false);

  const { query } = useRouter();
  const router = useRouter();

  useEffect(() => {
    console.log(query);
    if(query.auth == 'true') {
      setAuthState(true);
    }
  },[])

  return (
    <div className={styles.everything}>
      <Head>
        <title>NHSDLC Tabroom Tools</title>
        <link rel="icon" type="image/x-icon" href="/icon.png"/>
      </Head>
      <NavigationBar pageIndex={-1} auth={authState}/>
      <div className={styles.content}>
        <div className={styles.heading}>Tools List {!authState ? <span onClick={!authState ? (() => router.push(`/auth?path=/`)) : (() => {})} style={{fontWeight: "normal", fontSize: "0.6em", cursor: "pointer"}}>Login</span> : ""}</div>
        <ToolList auth={authState}/>
      </div>
    </div>
  );
};

export default Home;