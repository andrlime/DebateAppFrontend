import Link from "next/link";
import { FunctionComponent, useState } from "react";
import { NavigationItem } from "../../types/NavigationItem";
import styles from '../../styles/Q.module.css';

/** (1)
 * toolbox: NavigationItem[] = list of all navigation items
 */
const toolbox: NavigationItem[] = [
    {name: "Pairings Generator", description: "Generate pairings image from horizontal schematic", link: "/pair", auth: true},
    {name: "Results Image Generator", description: "Generator results as an image", link: "/results", auth: true},
    {name: "Results Spreadsheet Generator", description: "Generate results for a given division as a csv file", link: "/resultscsv", auth: true},
    {name: "Tabroom Import Spreadsheet Convertor", description: "Convert DLC namelist to Tabroom format spreadsheet", link: "/tabroom", auth: true},
    {name: "Evaluate Judges", description: "Judge evaluation system", link: "/evaluate", auth: true},
    {name: "View Paradigms", description: "See judge paradigms", link: "/paradigms", auth: false}
];

/** (2)
 * NavigationBar: FunComp{number} = navigation bar for sidebar
 */
export const NavigationBar: FunctionComponent<{pageIndex: number, auth: boolean}> = ({pageIndex, auth}) => {
    const [burger, setBurger] = useState(true); // whether the burger icon is the burger or the cross

    return (
        <div className={styles.navbar}>
        <div><Link href={"/"}><img width={80} src={"/icon.png"}/></Link></div>
        <br/>
        <div className={burger ? styles.burger : styles.cross} onClick={_ => setBurger(!burger)}><span></span><span></span><span></span></div>
        <div style={{padding: "1rem", color: "#0E397A"}}/>
        {!burger ? (<div>
        {(toolbox.filter(a => auth ? true : !a.auth)).map((item, index) => (
            <Link key={item.link} href={item.link}><div className={styles.menuLabel} style={{backgroundColor: index==pageIndex ? "#ECC132" : "", color: index==pageIndex ? "black" : ""}}>{item.name}</div></Link>
        ))}
        </div>) : ""}
        <div style={{position: "absolute", bottom: "2rem"}}>{!burger ? <img width="95%" alt={"Logo"} src={"/logo-white.png"}/> : ""}</div>
        </div>
    );
}

/** (3)
 * getEmoji: id=>emoji = get an emoji to look cool
 */
const getEmoji = (id: number) => {
    const EMOJI_LIBRARY = ['👀', '⭐️', '🍎', '🫐', '📕', '🎃']; // kind of stupid but who cares
    return EMOJI_LIBRARY[id%EMOJI_LIBRARY.length];
}

/** (4)
 * ToolCard = card view of items on /index page
 */  
const ToolCard: FunctionComponent<{id: number, name: string, description: string, onClick?: any}> = ({id, name, description, onClick}) => (
    <div onClick={onClick} className={styles.card}>

        <div className={styles.emoji}>{getEmoji(id)}</div>

        <div className={styles.nl}>
        <div className={styles.name}>{name}</div>
        <div className={styles.location}>{description}</div>
        </div>

    </div>
);

export const ToolList: FunctionComponent<{auth: boolean}> = ({auth}) => {
    return (
        <>{(toolbox.filter(a => auth ? true : !a.auth)).map((item, index) => (
            <Link key={item.link} href={item.link}>
                <ToolCard key={item.link} id={index} name={item.name} description={item.description}/>
            </Link>
        ))}</>
    );
}

export default NavigationBar;