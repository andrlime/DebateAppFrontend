import { FC, useState } from 'react';
import Judge from '../../types/Judge';
import FileUpload from '../create/FileUpload';
import axios from 'axios';
import { useRouter } from 'next/router';

export const UploadDownload: FC<{judges: Judge[], backendUrl: string, apiKey: string}> = ({judges, backendUrl, apiKey}) => {
    const [value, setValue] = useState("");
    const [loaded, setLoaded] = useState(false);
    const router = useRouter();

    const setV = async (e: string) => {
        setValue(e);
        setLoaded(true);

        // load the value
        let lines = (e.match(/.+/g) || ["FAILED"])
        if(lines[0]=="FAILED") return;

        if(lines[0].indexOf("id,name,email,nationality,gender,age,university") == -1) {
            return; // STOP
        }
        
        let splitArray = lines.slice(1);
        let resultsArray: any[] = [];
        for(let line of splitArray) {
            if(line.indexOf(",")==-1) return;
            let data = line.split(",");
            let jid = data[0];
            let email = data[1];
            let nationality = data[3];
            let gender = data[4] == '1' ? "Male" : data[4] == '2' ? "Female" : data[2];
            let age = data[5]; // if you don't type a number, it's your fault the code crashes
            let university = data[6];

            if(nationality == "" && gender == "" && age == "" && university == "") continue;
            
            resultsArray.push({_id: jid, email: email, options: {nationality: nationality, gender: gender, age: age, university: university}});
        }

        resultsArray.forEach(async (e) => {
            let result = await axios.post(`https://${backendUrl}/update/paradigm/${apiKey}/${e._id}`, {options: e.options});
        });

        router.push(`/auth?path=paradigms`,'/auth');
    };

    const downloadTemplate = () => {
        let data = "id,name,email,nationality,gender,age,university\n";

        for(let j of judges) {
            data += `${j._id},${j.name},${j.email},,,,\n`
        }

        data = 'data:text/csv;charset=utf-8,' + encodeURI(data);
        let fileName = `template_paradigms.csv`;
        saveAs(data, fileName);
    }

    const downloadAll = () => {
        let data = "id,name,email,nationality,gender,age,university\n";

        for(let j of judges) {
            data += `${j._id},${j.name},${j.email},${j.options?.nationality||""},${j.options?.gender||""},${j.options?.age||""},${j.options?.university||""}\n`
        }

        data = 'data:text/csv;charset=utf-8,' + encodeURI(data);
        let fileName = `exported_paradigms.csv`;
        saveAs(data, fileName)
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

    return (
        <div>
            <div>Download and Upload here. You can NOT mass upload paradigms due to Markdown format breaking the spreadsheet. You MUST manually add paradigms to each judge.</div>
            <div>Upload File: <FileUpload callback={setV} typesToAllow={".csv"}/></div>
            <div>Download Template: <button onClick={() => downloadTemplate()}>Download</button></div>
            <div>Download All: <button onClick={() => downloadAll()}>Download</button></div>
        </div>
    );
}

export default UploadDownload;