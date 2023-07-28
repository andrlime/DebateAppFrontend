/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Q.module.css';
import NavigationBar from '../components/nav/NavigationMenu';
import DebatePair from '../components/GeneratePairings';

const Home: NextPage = () => {
  return (
    <div className={styles.everything}>
      <Head>
        <title>NHSDLC Tabroom Tools - Pairings Tool</title>
        <link rel="icon" type="image/x-icon" href="/icon.png"/>
      </Head>
      <NavigationBar pageIndex={0} auth={true}/>
      <div className={styles.content}>
        
        <DebatePair/>
        
      </div>
    </div>
  );
};

export default Home;