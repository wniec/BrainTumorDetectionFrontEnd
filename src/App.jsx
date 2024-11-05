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
                onMouseUp={handleChange} // onChange when Images are cached
                style={{width: "300px"}}
            />
        </div>
    );
}

function PatientScans({patient, goBack, imageData}) {
    const [slice, setSlice] = useState(80);
    console.log(imageData.has(`patient/${slice}/t1.png`))
    const blobT1 = imageData.get(`patient/${slice}/t1.png`);
    const PNGBlobT1 = new Blob([blobT1], {type: "image/png"});
    const urlT1 = URL.createObjectURL(PNGBlobT1);

    const blobT2 = imageData.get(`patient/${slice}/t2.png`);
    const PNGBlobT2 = new Blob([blobT2], {type: "image/png"});
    const urlT2 = URL.createObjectURL(PNGBlobT2);

    const blobProfile = imageData.get(`patient/${slice}/profile.png`);
    console.log(blobProfile)
    const PNGBlobProfile = new Blob([blobProfile], {type: "image/png"});
    const urlProfile = URL.createObjectURL(PNGBlobProfile);
    //console.log(blob)
    //const url = URL.createObjectURL(blob);
    return (
        <>
            {patient.name}
            <div className="scanMenu">
                <button onClick={goBack}>Go back</button>
            </div>
            <div className="image-container">
                <img
                    src={urlT1}//{`http://${ip}:8000/images/${patient.id}/${slice}/t1`}
                ></img>
                <img
                    src={urlT2}//{`http://${ip}:8000/images/${patient.id}/${slice}/t2`}
                ></img>
                <img
                    src={urlProfile}//{`http://${ip}:8000/images/${patient.id}/${slice}/profile`}
                ></img>
            </div>
            <div className="slider-container">
                <SliderComponent setSlice={setSlice}/>
            </div>
        </>
    );
}

export default function App() {
    async function changeModeToScan({patient}) {
        const response = await fetch(`http://${ip}:8000/images/${patient.id}`);
        const buffer = await response.arrayBuffer();
        const zip = await JSZip.loadAsync(buffer);
        const imageDataMap = new Map();
        zip.forEach(async (relativePath, file) => {
            console.log(relativePath)
            //files.push(relativePath); // Save each file name in the array
            const blob = await file.async('blob').then();
            console.log(blob)
            //console.log(blob)
            void imageDataMap.set(relativePath, blob);
        });

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
