import React, {Fragment, useEffect, useState} from "react";
import {PieChart} from "react-minimal-pie-chart";
import '../../App.css'
import Table from "react-bootstrap/Table";
import {getParteiColor} from "../../utils";
import {ParteiDetails} from "./ParteiDetails";
import Button from "react-bootstrap/Button";
import {BASE_URL} from "../../App";

export function GesamtergebnisView(props) {
    const [abgeordneten, setAbgeordneten] = useState({
        abgeordneten: []
    });

    const [parteien, setParteien] = useState({
        gewinnerParteien: []
    });

    const [parteiDetails, setParteiDetails] = useState({
        visible: false,
        partei: ""
    });


    const updateParteien = async () => {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'useAggregates': props.useAggregates
            }
        };
        try {
            setParteien({...parteien});
            const response = await fetch(BASE_URL + props.filter + "/gewinnerparteien", requestOptions);
            const jsonData = await response.json();
            setParteien({...parteien, gewinnerParteien: jsonData});
        } catch (err) {
            console.error(err.message);
        }
    };

    const updateAbgeordneten = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'useAggregates': props.useAggregates
            }
        };
        try {
            setAbgeordneten({...abgeordneten});
            const response = await fetch(BASE_URL + props.filter + "/abgeordneten", requestOptions);
            const jsonData = await response.json();
            setAbgeordneten({...abgeordneten, abgeordneten: jsonData});
        } catch (err) {
            console.error(err.message);
        }
    };

    async function fetchData() {
        props.setLoading(true);
        await Promise.all([updateParteien(), updateAbgeordneten()]);
        props.setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [props.filter]);


    return (
        <div className="App">
            <ParteiDetails show={parteiDetails.visible}
                           partei={parteiDetails.partei}
                           onHide={() => setParteiDetails({visible: false, partei: ""})}
                           filter={props.filter}
                           useAggregates={props.useAggregates}/>

            <div className="ZusammensetzungPieChart">
                <PieChart
                    data={parteien.gewinnerParteien.map(partei => {
                        return {
                            title: partei.name,
                            value: parseInt(partei.anzahlsitze),
                            color: getParteiColor(partei.name)
                        }
                    })}
                    lengthAngle={180}
                    startAngle={180}
                    label={(p) => p.dataEntry.title}
                    labelStyle={{
                        fill: "white",
                        fontSize: '2px',
                        fontFamily: 'sans-serif',
                    }}
                    animate={true}
                    lineWidth={40}
                    paddingAngle={5}
                    labelPosition={80}
                    viewBoxSize={[100, 50]}
                />
            </div>

            <Fragment>
                <h2>Parteien</h2>
            </Fragment>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th scope="col">Partei</th>
                    <th scope="col">Sitze</th>
                    <th scope="col">Anteil</th>
                </tr>
                </thead>
                <tbody>
                {parteien.gewinnerParteien.map(partei => (
                    <tr key={'sitzverteilung-tr-' + partei.name}>
                        <td key={'sitzverteilung-td-partei-' + partei.name}><Button variant="link" size="sm"
                                                                                    onClick={() => setParteiDetails({
                                                                                        visible: true,
                                                                                        partei: partei.name
                                                                                    })}>{partei.name}</Button></td>
                        <td key={'sitzverteilung-td-sitze-' + partei.name}>{partei.anzahlsitze}</td>
                        <td key={'sitzverteilung-td-prozent-' + partei.name}>{partei.prozent}%</td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <div>
                <h2> Abgeordnete</h2>
            </div>

            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th scope="col">Vorname</th>
                    <th scope="col">Nachname</th>
                    <th scope="col">Partei</th>
                    <th scope="col">Wahlkreis</th>
                </tr>
                </thead>
                <tbody>
                {abgeordneten.abgeordneten.map((a, i) => (
                    <tr key={'abgeordneten-tr-' + i}>
                        <td key={'abgeordneten-td-Vorname-' + i}>{a.vorname}</td>
                        <td key={'abgeordneten-td-Nachname-' + i}>{a.nachname}</td>
                        <td key={'abgeordneten-td-Partei-' + i}>{a.partei}</td>
                        <td key={'abgeordneten-td-Wahlkreis-' + i}>{a.wahlkreis}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}
