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

    const t1_img = document.createElement('img',);
    t1_img.src = `http://127.0.0.1:8000/images/${patient_id}/${80}/t1`
    t1_img.id = 't1_view'

    const t2_img = document.createElement('img',);
    t2_img.src = `http://127.0.0.1:8000/images/${patient_id}/${80}/t2`
    t2_img.id = 't2_view'

    const profile = document.createElement('img',);
    profile.src = `http://127.0.0.1:8000/images/${patient_id}/${80}/profile`
    profile.id = 'profile_view'


    image.appendChild(t1_img)
    image.appendChild(t2_img)
    image.appendChild(profile)

    const button = document.createElement('button');
    button.appendChild(document.createTextNode("go back"));
    button.name = "see data"
    button.onclick = () => fetchPatients();

    image.appendChild(document.createElement('br'))
    const slider = document.createElement('input')
    slider.type = 'range'
    slider.min = '0'
    slider.max = '154'
    slider.defaultValue = "80"
    slider.class = "slider"
    slider.id = "myRange"
    slider.onchange = (event) => fetchImages(patient_id, event.target.value)
    image.appendChild(slider)
    image.appendChild(document.createElement('br'))
    image.appendChild(button);


}

async function fetchImages(patient_id, index) {
    let t1_img = document.getElementById('t1_view');
    t1_img.src = `http://127.0.0.1:8000/images/${patient_id}/${index}/t1`

    let t2_img = document.getElementById('t2_view');
    t2_img.src = `http://127.0.0.1:8000/images/${patient_id}/${index}/t2`

    let profile = document.getElementById('profile_view');
    profile.src = `http://127.0.0.1:8000/images/${patient_id}/${index}/profile`

}


function App() {


    return (
        <>
            <div className="card">
                <button onClick={fetchPatients}>get patients data</button>
            </div>
            <div id="info_section">
            </div>
        </>
    )
}


export default App
