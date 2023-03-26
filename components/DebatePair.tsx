/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Button, FileButton, Switch, Table, TextInput } from '@mantine/core';
import { NumberInput } from '@mantine/core';
import { DIV_DICT, RD_DICT, translate } from "../types/dictionaries";
import html2canvas from "html2canvas";
import pairStyles from '../styles/pair.module.css';

interface RoundTableProps {
    divName: string;
    rdName: string;
    startTime: number;
    rounds: Array<Round>;
    override: boolean;
    overriddenRoom: string;
}

interface Round {
    flight: string;
    teamA: string;
    teamB: string;
    judges: Array<{name: string, id: string}>;
}

interface RoundProps {
    flight: string;
    teamA: string;
    teamB: string;
    judges: Array<{name: string, id: string}>;
    override: boolean;
    overriddenRoom: string;
}

const RoundTableRow: React.FC<RoundProps> = ({flight, teamA, teamB, judges, overriddenRoom, override}) => {
    const [activeJudge, setActiveJudge] = useState<{name: string, id: string}>(judges[0]);

    return (
        <tr style={{alignItems: "center", fontWeight: "normal"}}>
            <td style={{backgroundColor: "#FEE499", border: "1px solid black", padding: "0.25rem", width: "0", color: "black", textAlign: "center", whiteSpace: "nowrap", fontWeight: "700"}}>{flight}</td>
            <td style={{width: "14.2857%", border: "1px solid black", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>
                <span style={{margin: "0.25rem", padding: "0.5rem"}}>{teamA}</span>
            </td>
            <td style={{padding: "0.25rem", border: "1px solid black", width: "14.2857%", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>{teamB}</td>
            {teamB !== "" ? <>
                <td style={{padding: "0.25rem", border: "1px solid black", width: "16.6667%", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>{override ? overriddenRoom : activeJudge.id}</td>
                <td style={{padding: "0.25rem", border: "1px solid black", width: "fit-content", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>{(judges).map((e,i) => (
                    <span key={e.id}><span className={pairStyles.judge} onClick={() => {
                        setActiveJudge(e);
                        let temp = judges[i];
                        judges[i] = judges[0];
                        judges[0] = temp;
                    }} style={{cursor: "pointer", transition: "all 0.3s ease-in-out", borderRadius: "9999px"}}>{`${e.name}${i===0&&judges.length>1 ? " ©" : ""}`}</span>{i !== judges.length-1 ? ", " : ""}</span>
                ))}</td>
            </> : <>
                <td style={{padding: "0.25rem", border: "1px solid black", width: "16.6667%", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}></td>
                <td style={{padding: "0.25rem", border: "1px solid black", width: "fit-content", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>BYE</td>
            </>}

        </tr>
    );
}

const SingleFlight: React.FC<{startTime: number, rounds: Array<Round>, flightNumber: number, override: boolean, overriddenRoom: string}> = ({startTime, rounds, flightNumber, override, overriddenRoom}) => {
    let bgc = flightNumber === 1 ? "#003A77" : "#4a1231";
    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", width: "100%"}}>
            <div style={{fontWeight: "700", fontSize: "1.2rem", color: "black", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <span>Flight {flightNumber===1 ? "A" : "B"}</span>
                <span style={{textAlign: "right"}}>Starts at {(startTime).toString().padStart(4, "0").substring(0,2) + ":" + (startTime).toString().padStart(4, "0").substring(2)}</span>
            </div>
            <Table style={{marginTop: "0.1rem", marginBottom: "1rem", textAlign: "left", fontSize: "1.125rem", fontWeight: "bold", border: "1px solid black"}}>
                <tr>
                    <td style={{padding: "0.25rem", border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}><span style={{padding: "0.3rem"}}>Flight</span></td>
                    <td style={{padding: "0.25rem", border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}>Team</td>
                    <td style={{padding: "0.25rem", border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}>Team</td>
                    <td style={{padding: "0.25rem", border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}>Room</td>
                    <td style={{padding: "0.25rem", border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}>Judges</td>
                </tr>
                {rounds.filter((a) => a.flight == `${flightNumber}`).map((e,i) => (
                <RoundTableRow key={e.teamA + "" + e.teamB} flight={e.flight} teamA={e.teamA} teamB={e.teamB} judges={e.judges} override={override} overriddenRoom={overriddenRoom}/>
                ))}
            </Table>
        </div>
    )
}

const RoundTable: React.FC<RoundTableProps> = ({divName, rdName, startTime, rounds, override, overriddenRoom}) => {
    return (
        <div style={{color: "#003A77", width: "75%", minWidth: "1000px", display: "flex", flexDirection: "column", textAlign: "center", padding: "1.25rem", whiteSpace: "nowrap"}} id="CONTAINER_TO_EXPORT">
            <div style={{fontFamily: `Georgia, "Times New Roman", Times, serif`, fontWeight: "bold", fontSize: "3rem"}}>{divName}</div>
            <div style={{fontFamily: `Georgia, "Times New Roman", Times, serif`, fontWeight: "bold", fontSize: "2rem"}}>{rdName}</div>

            <SingleFlight startTime={startTime} flightNumber={1} rounds={rounds} override={override} overriddenRoom={overriddenRoom}/>
            {rounds.filter(a => a.flight === "2").length > 0 ? <SingleFlight startTime={startTime + 100} flightNumber={2} rounds={rounds} override={override} overriddenRoom={overriddenRoom}/> : ""}

            <div style={{display: "flex", width: "100%", padding: "1rem"}}>
                <img style={{width: "36%"}} alt={"Logo"} src={"/logo.png"}/>
            </div>
        </div>
    );
}

export const DebatePair: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [content, setContent] = useState("");

    const [divName, setDivName] = useState("");
    const [rdName, setRdName] = useState("");
    const [stTime, setStTime] = useState<number | null>();
    const [rounds, setRounds] = useState<Array<Round>>([]);

    const [override, setOverride] = useState(false);
    const [overriddenId, setOverriddenId] = useState("");

    const exportAsPicture = () => {
        let data = document.getElementById('CONTAINER_TO_EXPORT')!
        html2canvas(data).then((canvas)=>{
            let image = canvas.toDataURL('image/png', 1.0);
            let fileName = `${divName}-${rdName}.png`;
            saveAs(image, fileName)
        })
    }

    const saveAs = (blob: any, fileName: string) =>{
        let elem = window.document.createElement('a');
        elem.href = blob
        elem.download = fileName;
        (document.body || document.documentElement).appendChild(elem);
        if (typeof elem.click === 'function') {
            elem.click();
        } else {
            elem.target = '_blank';
            elem.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
            }));
        }
        URL.revokeObjectURL(elem.href);
        elem.remove()
    }

    useEffect(() => {
        if(!file) return;
        file.text().then((res) => {
            setContent(res);
        })
    }, [file]);

    useEffect(() => {
        let LINES = content.split('\n');
        const METADATA = LINES[0];

        const MD_RX = /\w+/g;
        const MD_ARRAY = METADATA.match(MD_RX) || ["", ""];
        const D_NAME = translate(MD_ARRAY[0], DIV_DICT);
        const R_NAME = translate(MD_ARRAY[1], RD_DICT);
        setDivName(D_NAME);
        setRdName(R_NAME);

        // now we parse rounds
        LINES = LINES.splice(1);
        const allRounds: Array<Round> = [];
        for(const L of LINES) {
            let data = (L.substring(1, L.length-1)).split("\",\"");

            let currentRound: Round = {flight: "", teamA: "", teamB: "", judges: []};
            if(data[1] === "BYE") { // is a bye
                // easy, just define a blank round in flight 1
                currentRound.flight = "1";
                currentRound.teamA = data[3];
                currentRound.teamB = "";
                currentRound.judges = [{name: "", id: ""}];
            } else { // not a bye, parse normally
                // if undefined, continue
                if(!data[1]) continue;

                // take simple meta data
                currentRound.flight = (data[2].match(/\d/g)![0]) || "0";
                currentRound.teamA = data[3];
                currentRound.teamB = data[6];
                
                // parse judges
                let judges: Array<{name: string, id: string}> = [];
                for(let i = 10; i < data.length; i ++) {
                    // each element is now a judge
                    if(data[i].length === 0) continue;

                    let d = data[i].split(", ");
                    judges.push({name: d[1], id: d[0]});
                    currentRound.judges = judges;
                }
            }

            allRounds.push(currentRound);
        }

        setRounds(allRounds);
    }, [content]);

    return (
        <div style={{padding: "0.75rem"}}>
            {/* Settings */}
            <div style={{padding: "0.75rem", paddingTop: "0.125rem", paddingBottom: "0.125rem", display: "flex", flexDirection: "column"}}>
                <span style={{fontWeight: "bold"}}>Upload the horizontal schematic for this round here</span>
                <div style={{display: "flex", flexDirection: "row", width: "fit-content", alignItems: "center"}}>
                    <FileButton onChange={setFile} accept={".csv"}>
                        {(props) => <>Pairings CSV: <Button style={{width: "fit-content", margin: "0.25rem", marginLeft: "1rem"}} color={"grape"} variant={"outline"} {...props}>Upload File</Button></>}
                    </FileButton>
                </div>
            </div>
            <div style={{padding: "0.75rem", paddingTop: "0.125rem", paddingBottom: "0.125rem", display: "flex", flexDirection: "column"}}>
                <span style={{fontWeight: "bold"}}>Make manual adjustments</span>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <TextInput value={divName} description={divName} onChange={(event) => setDivName(event.currentTarget.value)} style={{margin: "0.25rem", marginLeft: "0"}} label={"Division Name"} placeholder={"Division Name"} error={!divName || divName === "MANUALLY CHANGE" ? "Please enter the division name" : ""}/>
                    <TextInput value={rdName} description={rdName} onChange={(event) => setRdName(event.currentTarget.value)} style={{margin: "0.25rem"}} label={"Round Name"} placeholder={"Round Name"} error={!rdName || rdName === "MANUALLY CHANGE" ? "Please enter the round name" : ""}/>
                    <NumberInput value={stTime || ""} max={2359} description={(stTime || "").toString().padStart(4, "0").substring(0,2) + ":" + (stTime || "").toString().padStart(4, "0").substring(2)} error={!stTime ? "Please enter the round start time" : ""} onChange={(event) => {
                        if(!event) setStTime(0);
                        if(event < 2400 && event > 0) setStTime(event || 0);
                    }} style={{margin: "0.25rem"}} label={"Start Time"} placeholder={"Start Time"} hideControls/>
                </div>
            </div>
            <div style={{padding: "0.75rem", paddingTop: "0.125rem", paddingBottom: "0.125rem", display: "flex", flexDirection: "column"}}>
                <span style={{fontWeight: "bold"}}>Need to force change the room code? Please only do this during a finals round.</span>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <Switch checked={override} onChange={(e) => setOverride(e.currentTarget.checked)} label={'Override room ID?'} description={"Toggle to force change all meeting IDs"}/>
                    {override ? <TextInput style={{width: "fit-content"}} value={overriddenId} onChange={(e) => setOverriddenId(e.currentTarget.value)} placeholder={"Overridden Room ID"}/> : ""}
                </div>
            </div>
            <div style={{padding: "0.75rem", paddingTop: "0.125rem", paddingBottom: "0.125rem", display: "flex", flexDirection: "column"}}>
                <span style={{fontWeight: "bold", color: "rgb(239 68 68)"}}>If you need to adjust a round&#39;s chair, please click that judge&#39;s name.</span>
            </div>
            <div style={{padding: "0.75rem", paddingTop: "0.125rem", paddingBottom: "0.125rem", display: "flex", flexDirection: "column"}}>
                <span style={{fontWeight: "bold"}}>Export as image</span>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <Button onClick={exportAsPicture} style={{width: "fit-content", margin: "0.25rem", marginLeft: "0"}} color={"orange"} variant={"outline"} disabled={!divName || divName === "MANUALLY CHANGE" || !rdName || rdName === "MANUALLY CHANGE" || !stTime}>Export</Button>
                    <span style={{color: "rgb(239 68 68)"}}>{!divName || divName === "MANUALLY CHANGE" || !rdName || rdName === "MANUALLY CHANGE" || !stTime ? "Please fix errors" : ""}</span>
                </div>
            </div>

            {/* Show the table */}
            {content === "" ? "" : <RoundTable divName={divName} rdName={rdName} startTime={stTime || 0} rounds={rounds} override={override} overriddenRoom={overriddenId}/>}
        </div>
    );
};

export default DebatePair;
