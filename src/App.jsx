import {useState, useEffect} from "react";
import {Modes} from "./types";
import "./App.css";
import JSZip from "jszip";

const ip = '10.204.141.208';

function PatientsList({goToPatient}) {
    const [patients, setPatients] = useState([]);
    const listOfPatients = patients.map((patient) => {
        return (
            <li key={patient.id}>
                <button onClick={() => goToPatient({patient})}>{patient.name}</button>
                <h2>danger: {Math.round((patient.danger + Number.EPSILON) * 100) / 100}</h2>
            </li>
        );
    });

    async function fetchPatients() {
        const response = await fetch(`http://${ip}:8000/patients`);
        const data = await response.json();
        setPatients(data);
    }

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <>
            <div className="listMenu">
                <button onClick={fetchPatients}>Reload patients</button>
            </div>
            <div>
                <ol>{listOfPatients}</ol>
            </div>
        </>
    );
}

function ScanImage({blob}) {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (blob) {
            const objectUrl = URL.createObjectURL(new Blob([blob], {type: 'image/png'}));
            setUrl(objectUrl);

            // Clean up the object URL when the component unmounts
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [blob]);

    return url ? <img src={url} className={"scan-image"}/> : null;
}

function ImageBox({blob, prediction, combine}) {
    if (combine)
        return (<div className="ImageBox">

            <ScanImage blob={blob}></ScanImage>
            <ScanImage blob={prediction}></ScanImage>
        </div>)
    else
        return (<div className="ImageBox">
            <ScanImage blob={blob}></ScanImage>
        </div>)
}

function ScanBox({blob, prediction, combine, description}) {
    return (<div className="ScanBox">
        <ImageBox blob={blob} prediction={prediction} combine={combine}></ImageBox>
        <h3>{description}</h3>
    </div>)
}


function SliderComponent({setSlice}) {
    function handleChange(event) {
        console.log(event.target.value);
        setSlice(event.target.value);
    }

    return (
        <div>
            <input
                defaultValue="80"
                className="slider"
                type="range"
                min="0"
                max="154"
                onChange={handleChange}
                // onMouseUp={handleChange} // onChange when Images are cached
                style={{width: "300px"}}
            />
        </div>
    );
}

function PatientScans({patient, goBack, imageData}) {
    const [slice, setSlice] = useState(80);
    const [preds, setPreds] = useState(true);

    const blobPrediction = imageData.get(`patient/${slice}/prediction.png`);
    const blobT1 = imageData.get(`patient/${slice}/t1.png`);
    const blobT2 = imageData.get(`patient/${slice}/t2.png`);
    const blobProfile = imageData.get(`patient/${slice}/profile.png`);
    const flair_exists = imageData.has(`patient/${slice}/flair.png`)

    if (flair_exists) {
        const blobFLAIR = imageData.get(`patient/${slice}/flair.png`);

        return (
            <>
                {patient.name}
                <div className="scanMenu">
                    <button onClick={goBack}>Go back</button>
                    <button
                        onClick={() => setPreds(!preds)}>{preds ? "Turn Off model Predictions" : "Turn On model Predictions"}</button>
                </div>
                <div className="image-container">
                    <ScanBox blob={blobT1} prediction={blobPrediction} combine={preds} description={"T1"}></ScanBox>
                    <ScanBox blob={blobT2} prediction={blobPrediction} combine={preds} description={"T2"}></ScanBox>
                    <ScanBox blob={blobFLAIR} prediction={blobPrediction} combine={preds}
                             description={"FLAIR"}></ScanBox>
                    <ScanImage blob={blobProfile}></ScanImage>
                </div>
                <div className="slider-container">
                    <SliderComponent setSlice={setSlice}/>
                </div>
            </>
        );
    } else {
        return (
            <>
                {patient.name}
                <div className="scanMenu">
                    <button onClick={goBack}>Go back</button>
                    <button
                        onClick={() => setPreds(!preds)}>{preds ? "Turn Off model Predictions" : "Turn On model Predictions"}</button>
                </div>
                <div className="image-container">
                    <ScanBox blob={blobT1} prediction={blobPrediction} combine={preds} description={"T1"}></ScanBox>
                    <ScanBox blob={blobT2} prediction={blobPrediction} combine={preds} description={"T2"}></ScanBox>
                    <ScanImage blob={blobProfile}></ScanImage>
                </div>
                <div className="slider-container">
                    <SliderComponent setSlice={setSlice}/>
                </div>
            </>
        );
    }
}

//const url = URL.createObjectURL(blob);


export default function App() {
    async function changeModeToScan({patient}) {
        const response = await fetch(`http://${ip}:8000/images/${patient.id}`);
        const buffer = await response.arrayBuffer();
        const zip = await JSZip.loadAsync(buffer);
        const imageDataMap = new Map();
        await Promise.all(
            Object.keys(zip.files).map(async (relativePath) => {
                const file = zip.files[relativePath];
                const blob = await file.async('blob');
                imageDataMap.set(relativePath, blob);
            })
        );

        // Create an object URL for the Blob to use as an image source
        //var gunzip = new Zlib.Gunzip(compressed);
        //var plain = gunzip.decompress();
        console.log(response);
        console.log(response)
        setCurrentPatient(patient);
        await setImageData(imageDataMap);
        setMode(Modes.SCAN);
    }

    function changeModeToList() {
        setMode(Modes.LIST);
    }

    const [mode, setMode] = useState(Modes.LIST);
    const [currentPatient, setCurrentPatient] = useState(null);
    const [imageData, setImageData] = useState(null);

    if (mode === Modes.LIST) {
        return (
            <>
                <div className="menu">
                    <PatientsList goToPatient={changeModeToScan}/>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="menu">
                    <PatientScans patient={currentPatient} goBack={changeModeToList} imageData={imageData}/>
                </div>
            </>
        );
    }
}
