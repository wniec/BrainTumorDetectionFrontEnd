import './App.css'

async function fetchPatientData(patient_id) {
    const response = await fetch(`http://127.0.0.1:8000/images/${patient_id}`);
    const data = await response.json();
    if (response.ok) {
        console.log(data.image)
        console.log(data.tumor_map)
    } else {
        console.log('Person not found');
    }
}

async function fetchPatients() {
    const response = await fetch('http://127.0.0.1:8000/patients');
    const data = await response.json();
    const patientsList = document.getElementById('info_section');
    patientsList.innerHTML = '';
    data.forEach(patient => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        const button = document.createElement('button');
        button.appendChild(document.createTextNode("see image"));
        button.name = "see data"
        button.onclick = () => {
            setFetchingImg(patient.id)
        };
        link.href = '#';
        link.innerHTML = patient.id;
        link.onclick = () => fetchPatientData(patient.id);
        listItem.innerHTML = `${patient.name}, Danger: ${patient.danger}`;
        listItem.appendChild(link);
        listItem.appendChild(button);
        patientsList.appendChild(listItem);
    });
}


async function setFetchingImg(patient_id) {

    //const slider = (<Slider />)
    //document.body.appendChild(fetchImg(patient_id, 0))
    const image = document.getElementById('info_section')
    image.innerHTML = ''
    const img = document.createElement('img',);
    img.src = `http://127.0.0.1:8000/images/${patient_id}/${80}`
    img.id = 'view'
    image.appendChild(img)
    //document.body.appendChild(slider)
    const button = document.createElement('button');
    button.appendChild(document.createTextNode("go back"));
    button.name = "see data"
    button.onclick = () => fetchPatients();
    image.appendChild(document.createElement('br'))
    const slider = document.createElement('input')
    slider.type = 'range'
    slider.min = '0'
    slider.max = '155'
    slider.defaultValue = "80"
    slider.class = "slider"
    slider.id = "myRange"
    slider.onchange = (event) => fetchImg(patient_id, event.target.value)
    image.appendChild(slider)
    image.appendChild(document.createElement('br'))
    image.appendChild(button);


}

async function fetchImg(patient_id, index) {
    let img = document.getElementById('view');
    img.src = `http://127.0.0.1:8000/images/${patient_id}/${index}`

}


function App() {


    return (
        <>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={fetchPatients}>get patients data</button>
            </div>
            <div id="info_section">
            </div>
        </>
    )
}


export default App
