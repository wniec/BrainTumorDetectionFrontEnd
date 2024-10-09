import { useState, useEffect } from "react";
import { Modes } from "./types";
import "./App.css";

async function fetchPatientData(patient_id) {
  const response = await fetch(`http://127.0.0.1:8000/images/${patient_id}`);
  const data = await response.json();
  if (response.ok) {
    console.log(data.image);
    console.log(data.tumor_map);
  } else {
    console.log("Person not found");
  }
}

// async function fetchPatients() {
//     const response = await fetch('http://127.0.0.1:8000/patients');
//     const data = await response.json();
//     const patientsList = document.getElementById('info_section');
//     patientsList.innerHTML = '';
//     data.forEach(patient => {
//         const listItem = document.createElement('li');
//         const link = document.createElement('a');

//         const button = document.createElement('button');
//         button.appendChild(document.createTextNode("see image"));
//         button.name = "see data"
//         button.onclick = () => {
//             setFetchingImg(patient.id)
//         };
//         link.href = '#';
//         link.innerHTML = patient.id;
//         link.onclick = () => fetchPatientData(patient.id);
//         listItem.innerHTML = `${patient.name}, Danger: ${patient.danger}`;
//         listItem.appendChild(link);
//         listItem.appendChild(button);
//         patientsList.appendChild(listItem);
//     });
// }

async function setFetchingImg(patient_id) {
  //const slider = (<Slider />)
  //document.body.appendChild(fetchImg(patient_id, 0))
  const image = document.getElementById("info_section");
  image.innerHTML = "";

  const t1_img = document.createElement("img");
  t1_img.src = `http://127.0.0.1:8000/images/${patient_id}/${80}/t1`;
  t1_img.id = "t1_view";

  const t2_img = document.createElement("img");
  t2_img.src = `http://127.0.0.1:8000/images/${patient_id}/${80}/t2`;
  t2_img.id = "t2_view";

  const profile = document.createElement("img");
  profile.src = `http://127.0.0.1:8000/images/${patient_id}/${80}/profile`;
  profile.id = "profile_view";

  image.appendChild(t1_img);
  image.appendChild(t2_img);
  image.appendChild(profile);

  const button = document.createElement("button");
  button.appendChild(document.createTextNode("go back"));
  button.name = "see data";
  button.onclick = () => fetchPatients();

  image.appendChild(document.createElement("br"));
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "154";
  slider.defaultValue = "80";
  slider.class = "slider";
  slider.id = "myRange";
  slider.onchange = (event) => fetchImages(patient_id, event.target.value);
  image.appendChild(slider);
  image.appendChild(document.createElement("br"));
  image.appendChild(button);
}

async function fetchImages(patient_id, index) {
  let t1_img = document.getElementById("t1_view");
  t1_img.src = `http://127.0.0.1:8000/images/${patient_id}/${index}/t1`;

  let t2_img = document.getElementById("t2_view");
  t2_img.src = `http://127.0.0.1:8000/images/${patient_id}/${index}/t2`;

  let profile = document.getElementById("profile_view");
  profile.src = `http://127.0.0.1:8000/images/${patient_id}/${index}/profile`;
}

// --------------------------------------------------

function PatientsList({ goToPatient }) {
  const [patients, setPatients] = useState([]);

  const listOfPatients = patients.map((patient) => {
    return (
      <li key={patient.id}>
        <button onClick={() => goToPatient({ patient })}>{patient.name}</button>
      </li>
    );
  });

  async function fetchPatients() {
    const response = await fetch("http://127.0.0.1:8000/patients");
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

function SliderComponent() {
  const [value, setValue] = useState(80);
  return (
    <div>
      <h2>Slider Value: {value}</h2>
      {/* Slider input */}
      <input
        defaultValue="80"
        class="slider"
        type="range"
        min="0"
        max="154"
        // onChange={handleSliderChange} // Updates value on movement
        style={{ width: "300px" }}
      />
    </div>
  );
}

function PatientScans({ patient, goBack }) {
  console.log(patient);
  console.log(patient.id);

  const [slice, setSlice] = useState(80);

  return (
    <>
      <div className="scanMenu">
        <button onClick={goBack}>Go back</button>
        {patient.id}
      </div>
      <div className="image-container">
        <img
          src={`http://127.0.0.1:8000/images/${patient.id}/${slice}/t1`}
        ></img>
        <img
          src={`http://127.0.0.1:8000/images/${patient.id}/${slice}/t2`}
        ></img>
        <img
          src={`http://127.0.0.1:8000/images/${patient.id}/${slice}/profile`}
        ></img>
      </div>
      <div className="slider-container">
        <SliderComponent />
      </div>
    </>
  );
}

export default function App() {
  function changeModeToScan({ patient }) {
    console.log(patient);
    setCurrentPatient(patient);
    setMode(Modes.SCAN);
  }
  function changeModeToList() {
    setMode(Modes.LIST);
  }

  const [mode, setMode] = useState(Modes.LIST);
  const [currentPatient, setCurrentPatient] = useState(null);

  if (mode === Modes.LIST) {
    return (
      <>
        <div className="menu">
          <PatientsList goToPatient={changeModeToScan} />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="menu">
          <PatientScans patient={currentPatient} goBack={changeModeToList} />
        </div>
      </>
    );
  }
}
