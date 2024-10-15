import { useState, useEffect } from "react";
import { Modes } from "./types";
import "./App.css";

function PatientsList({ goToPatient }) {
  const [patients, setPatients] = useState([]);
  const ip = '34.118.83.75';
  const listOfPatients = patients.map((patient) => {
    return (
      <li key={patient.id}>
        <button onClick={() => goToPatient({ patient })}>{patient.name}</button>
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

function SliderComponent({ setSlice }) {
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
        style={{ width: "300px" }}
      />
    </div>
  );
}

function PatientScans({ patient, goBack }) {
  const [slice, setSlice] = useState(80);

  return (
    <>
      {patient.name}
      <div className="scanMenu">
        <button onClick={goBack}>Go back</button>
      </div>
      <div className="image-container">
        <img
          src={`http://${ip}:8000/images/${patient.id}/${slice}/t1`}
        ></img>
        <img
          src={`http://${ip}:8000/images/${patient.id}/${slice}/t2`}
        ></img>
        <img
          src={`http://${ip}:8000/images/${patient.id}/${slice}/profile`}
        ></img>
      </div>
      <div className="slider-container">
        <SliderComponent setSlice={setSlice} />
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
