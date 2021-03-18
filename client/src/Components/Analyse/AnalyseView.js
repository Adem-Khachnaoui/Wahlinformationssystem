import React, {useEffect, useState} from "react";
import {Line} from "react-chartjs-2"
import Dropdown from "react-bootstrap/Dropdown";
import {BASE_URL} from "../../App";

const Modes = {
    einkommen: "Einkommen",
    wohndichte: "Wohndichte"
}


export function AnalyseView(props) {
    const [selectedMode, setSelectedMode] = useState(Modes.wohndichte);
    const [selectedPartei, setSelectedPartei] = useState("FDP");
    const [parteien, setParteien] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);


    const updateParteien = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'useAggregates': props.useAggregates
            }
        };
        try {
            const response = await fetch(BASE_URL + "parteien", requestOptions);
            const jsonData = await response.json();
            setParteien(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    const updateData = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'useAggregates': props.useAggregates
            }
        };
        try {
            const response = await fetch(BASE_URL  + props.filter + "/analysen/parteien/" + selectedPartei + "/" + selectedMode, requestOptions);
            const jsonData = await response.json();
            setChartData(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    async function fetchData() {
        props.setLoading(true);
        setLoading(true);
        await Promise.all([updateParteien(),updateData()]);
        setLoading(false);
        props.setLoading(false);
    }

    useEffect(() => {
        fetchData()
    }, [selectedPartei, selectedMode, props.filter]);


    function changeMode(value) {
        if (Object.values(Modes).includes(value.target.innerHTML)) {
            setSelectedMode(value.target.innerHTML)
        }
    }

    function changePartei(value) {
        if (parteien.filter(p => {
            return p.name === value.target.innerHTML
        }).length !== 0) {
            setSelectedPartei(value.target.innerHTML)
        }
    }


    const data = {
        labels: chartData.map(d => {
            return selectedMode === Modes.einkommen ? d.einkommen : d.wohndichte
        }),
        datasets: [
            {
                label: 'Durchschnittlicher Anteil an Gesamtstimmen',
                data: chartData.map(d => parseFloat(d.anteil_stimmen)),
                fill: false,
                borderColor: selectedMode === Modes.einkommen ? "rgba(39,114,202,0.82)" : "rgba(24,202,87,0.82)",
            },
        ],
    };

    const options = {
        scales: {
            yAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: 'Anteil an Gesamtstimmen'
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function (label, index, labels) {
                            return label + '%';
                        }
                    },
                },
            ], xAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: selectedMode + (selectedMode === Modes.einkommen ? " (euro/Jahr)": " (1000 Einwohner/ km²)")
                    }
                }]
        }
    }

    return (
        <div className="App">
            <div className="ToggleButtons">
                <div className="Button">
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic1">
                            Partei: {selectedPartei}
                        </Dropdown.Toggle>

                        <Dropdown.Menu onClick={changePartei}>
                            {parteien.map(p => {
                                return (<Dropdown.Item id={p.name}>{p.name}</Dropdown.Item>)
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="Button">
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic2">
                            Parameter: {selectedMode}
                        </Dropdown.Toggle>

                        <Dropdown.Menu onClick={changeMode}>
                            {Object.values(Modes).map(m => {
                                return (<Dropdown.Item id={m}>{m}</Dropdown.Item>)
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            {!loading && ((chartData.length === 0) ?
                <h2 style={{'padding-top': '200px'}}>{selectedPartei} hat nicht an der Wahl im
                    Jahr {props.filter} teilgenommen</h2> :
                <Line data={data} options={options}/>)
            }
        </div>
    )
}
