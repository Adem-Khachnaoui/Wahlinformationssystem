import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import {BASE_URL} from "../../App";


export function ParteiDetails(props) {

    const [winners, setWinners] = useState([]);

    const [losers, setLosers] = useState([]);

    const [loadingWinners, setLoadingWinners] = useState(false);
    const [loadingLosers, setLoadingLosers] = useState(false);


    const updateWinners = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'useAggregates': props.useAggregates
            }
        };
        try {
            const response = await fetch(BASE_URL  + props.filter + "/parteien/" + props.partei + "/knappstesieger", requestOptions);
            const jsonData = await response.json();
            setWinners(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    const updateLosers = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'useAggregates': props.useAggregates
            }
        };
        try {
            const response = await fetch(BASE_URL  + props.filter + "/parteien/" + props.partei + "/knappsteverlierer", requestOptions);
            const jsonData = await response.json();
            setLosers(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    async function fetchData() {
        updateWinners().then(() => setLoadingWinners(false));
        updateLosers().then(() => setLoadingLosers(false));
    }

    useEffect(async () => {
        if (props.show) {
            setLosers([]);
            setWinners([]);
            setLoadingWinners(true);
            setLoadingLosers(true);
            await fetchData();
        }
    }, [props.partei, props.filter]);


    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <div className="Modal">
                    <h4>Details über {props.partei}</h4>

                    {(loadingLosers || loadingWinners) && <Spinner animation="border" role="status"/>}

                    {(winners && winners.length !== 0) && (
                        <div>
                            <h5 className="Subtitle">Knappste Sieger unter den Direktkandidaten</h5>

                            <Table striped bordered hover size="sm">
                                <thead>
                                <tr>
                                    <th scope="col">Vorname</th>
                                    <th scope="col">Nachname</th>
                                    <th scope="col">Stimmkreis</th>
                                    <th scope="col">Vorsprung</th>
                                </tr>
                                </thead>
                                <tbody>
                                {winners.map((a, i) => (
                                    <tr key={'abgeordneten-tr-' + i}>
                                        <td key={'abgeordneten-td-Vorname-' + i}>{a.vorname}</td>
                                        <td key={'abgeordneten-td-Nachname-' + i}>{a.nachname}</td>
                                        <td key={'abgeordneten-td-Partei-' + i}>{a.stimmkreis}</td>
                                        <td key={'abgeordneten-td-Wahlkreis-' + i}>{a.vorsprung}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>)
                    }

                    {(losers && losers.length !== 0) && (
                        <div>
                            <h5 className="Subtitle">Knappste Verlierer unter den Direktkandidaten</h5>

                            <Table striped bordered hover size="sm">
                                <thead>
                                <tr>
                                    <th scope="col">Vorname</th>
                                    <th scope="col">Nachname</th>
                                    <th scope="col">Stimmkreis</th>
                                    <th scope="col">Rückstand</th>
                                </tr>
                                </thead>
                                <tbody>
                                {losers.map((a, i) => (
                                    <tr key={'abgeordneten-tr-' + i}>
                                        <td key={'abgeordneten-td-Vorname-' + i}>{a.vorname}</td>
                                        <td key={'abgeordneten-td-Nachname-' + i}>{a.nachname}</td>
                                        <td key={'abgeordneten-td-Partei-' + i}>{a.stimmkreis}</td>
                                        <td key={'abgeordneten-td-Wahlkreis-' + i}>{a.rueckstand}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>)
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

