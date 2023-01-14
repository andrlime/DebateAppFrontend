import axios from "axios";
import { useRouter } from "next/router";
import { FunctionComponent, useState, useRef, useEffect } from "react";
import { Judge } from "../../types/Judge";
import styles from '../../styles/Q.module.css';
import { EvalUploadArea } from "./EvalUploadArea";
import { Evaluation } from "../../types/Evaluation";

export const CreateEvaluation: FunctionComponent<{callback: Function, judge: Judge, updateJudge: Function}> = ({callback, judge, updateJudge}) => {
    const [tournament, setTournament] = useState("");
    const [round, setRound] = useState("Round 1");
    const [flight, setFlight] = useState("A");
  
    const [dec, setDec] = useState(0);
    const [comp, setComp] = useState(0);
    const [cit, setCit] = useState(0);
    const [cov, setCov] = useState(0);
    const [bias, setBias] = useState(0);
  
    const [improvement, setImprovement] = useState(false);
    const [division, setDivision] = useState("");
  
    const backendUrl = useRef("");
    const apiKey = useRef("");

    const storeTournamentNameInCookies = (tournamentName: string) => {
      if(tournamentName=="") return;
      else {
        localStorage.setItem('tname', tournamentName);
      }
    }
  
    const readTournamentNameFromCookies = () => {
      if(localStorage.tname) {
        setTournament(localStorage.tname);
      } else {
        setTournament("");
      }
    }
  
    useEffect(() => {
      axios.get("/api/getkey").then((res)=> {
        backendUrl.current = res.data.backendUrl || "";
        apiKey.current = res.data.apiKey || "";
      });
      readTournamentNameFromCookies();
    },[]);

    const uploadEvaluationsCallback = (input: Evaluation[]) => {
      let newEv = [...input, ...judge.evaluations].sort((a: Evaluation, b: Evaluation) => (new Date(a.date).toString()) < (new Date(b.date).toString()) ? 1 : -1);
      updateJudge(newEv);

      //upload to database
      for(let ev of [...input]) {
        console.log(ev);
        let body = {
          tName: ev.isImprovement ? "Improvement Round" : ev.tournamentName,
          dName: ev.isImprovement ? "None" : division,
          date: "",
          rName: ev.isImprovement ? "Improvement Round" : `${ev.roundName}`, // e.g., Round 1 Flight A etc.
          isPrelim: ev.roundName.indexOf("Round")!=-1&&!ev.isImprovement, // ignores input
          isImprovement: ev.isImprovement,
          decision: ev.decision,
          comparison: ev.comparison,
          citation: ev.citation,
          coverage: ev.coverage,
          bias: ev.bias,
          weight: 1,
        }
        axios.post(`https://${backendUrl.current}/update/judge/${apiKey.current}/${query.judgeId}`, body).then((_) => {});
      }
    }
  
    const { query } = useRouter();
  
    return (<div className={styles.sublabel} style={{paddingLeft: "0rem", flexDirection: "column"}}>
  
      <div className={styles.createform}>
        <div style={{margin: "0.15rem"}}>Tournament Name: <input value={tournament} onChange={(e) => setTournament(e.target.value)} type={'text'} style={{width: "100%"}}></input></div>
        
        <div style={{margin: "0.15rem"}}>Round Name: <select disabled={improvement} value={round} onChange={(e) => {setRound(e.target.value)}} style={{width: "100%"}}>
          <option value={"Round 1"}>Round 1</option>
          <option value={"Round 2"}>Round 2</option>
          <option value={"Round 3"}>Round 3</option>
          <option value={"Round 4"}>Round 4</option>
          <option value={"Round 5"}>Round 5</option>
          <option value={"Round 6"}>Round 6</option>
          <option value={"Triple Octofinals"}>Triple Octofinals</option>
          <option value={"Double Octofinals"}>Double Octofinals</option>
          <option value={"Octofinals"}>Octofinals</option>
          <option value={"Quarterfinals"}>Quarterfinals</option>
          <option value={"Semifinals"}>Semifinals</option>
          <option value={"Grand Finals"}>Grand Finals</option>
          </select></div>
        <div style={{margin: "0.15rem"}}>Division: <select disabled={improvement}  value={division} onChange={(e) => {setDivision(e.target.value)}} style={{width: "100%"}}>
          <option value={"None"}>None</option>
          <option value={"Novice"}>Novice</option>
          <option value={"Middle School"}>Middle School</option>
          <option value={"Open"}>Open</option>
          <option value={"Mixed"}>Mixed</option>
          </select></div>

        <div style={{margin: "0.15rem"}}>Flight: <select disabled={improvement}  value={flight} onChange={(e) => {setFlight(e.target.value)}} style={{width: "100%"}}>
          <option value={"A"}>A</option>
          <option value={"B"}>B</option>
          </select></div>
        
      </div>
      <div className={styles.createform}>
        <div style={{margin: "0.15rem"}}>Decision Score: <input value={dec} onChange={(e) => {
          let number = parseFloat(e.target.value) || 0;
          if (number > 1.5) setDec(1.5);
          else if (number < 0) setDec(0);
          else setDec(number);
        }} type={'number'}></input></div>
  
        <div style={{margin: "0.15rem"}}>Comparison Score: <input value={comp} onChange={(e) => {
          let number = parseFloat(e.target.value) || 0;
          if (number > 1.5) setComp(1.5);
          else if (number < 0) setComp(0);
          else setComp(number);
        }} type={'number'}></input></div>
  
        <div style={{margin: "0.15rem"}}>Citation Score: <input value={cit} onChange={(e) => {
          let number = parseFloat(e.target.value) || 0;
          if (number > 1.5) setCit(1.5);
          else if (number < 0) setCit(0);
          else setCit(number);
        }} type={'number'}></input></div>
  
        <div style={{margin: "0.15rem"}}>Coverage Score: <input value={cov} onChange={(e) => {
          let number = parseFloat(e.target.value) || 0;
          if (number > 1.5) setCov(1.5);
          else if (number < 0) setCov(0);
          else setCov(number);
        }} type={'number'}></input></div>
  
        <div style={{margin: "0.15rem"}}>Bias Score: <input value={bias} onChange={(e) => {
          let number = parseFloat(e.target.value) || 0;
          if (number > 1.5) setBias(1.5);
          else if (number < 0) setBias(0);
          else setBias(number);
        }} type={'number'}></input></div>
      </div>

      <div className={styles.createform}>
        <div style={{marginRight: "0.5rem", whiteSpace: "nowrap"}}>Check if this is an improvement or sample round<input checked={improvement} onChange={(_) => setImprovement(!improvement)} type={'checkbox'}/></div>
        <div style={{marginRight: "0.5rem", whiteSpace: "nowrap"}}>This box will auto check if the round is a prelims round<input checked={round.indexOf("Round")!=-1&&!improvement} type={'checkbox'}/></div>
      </div>

      <div className={styles.createform}>
        <button onClick={(_) => {
          let body = {
            tName: improvement ? "Improvement Round" : tournament,
            dName: improvement ? "None" : division,
            rName: improvement ? "Improvement Round" : `${round} Flight ${flight}`, // e.g., Round 1 Flight A etc.
            isPrelim: round.indexOf("Round")!=-1&&!improvement,
            isImprovement: improvement,
            decision: dec,
            comparison: comp,
            citation: cit,
            coverage: cov,
            bias: bias,
            weight: 1,
            date: new Date()
          };
  
          callback({
            tournamentName: improvement ? "Improvement Round" : tournament,
            division: improvement ? "None" : division,
            date: "",
            roundName: improvement ? "Improvement Round" : `${round} Flight ${flight}`, // e.g., Round 1 Flight A etc.
            isPrelim: round.indexOf("Round")!=-1&&!improvement,
            isImprovement: improvement,
            decision: dec,
            comparison: comp,
            citation: cit,
            coverage: cov,
            bias: bias,
            weight: 1,
          });

          storeTournamentNameInCookies(tournament);
          axios.post(`https://${backendUrl.current}/update/judge/${apiKey.current}/${query.judgeId}`, body).then((_) => {});
        }}>Create Evaluation</button>
      </div>

      <div className={styles.createform}>
        <EvalUploadArea judge={judge} addEval={uploadEvaluationsCallback}/>
      </div>
  
    </div>);
  }