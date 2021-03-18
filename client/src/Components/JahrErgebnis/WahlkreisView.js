import React, {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import {Doughnut} from "react-chartjs-2";
import {getParteiColor} from "../../utils";
import {BASE_URL} from "../../App";


export function WahlkreisView(props) {

    const [beteiligung, setBeteiligung] = useState({
        wahlberechtigte: 0,
        waehler: 0,
        beteiligung: 0,
    });

    const [gewinner, setGewinner] = useState([]);

    const [parteien, setParteien] = useState([]);

    const updateGewinnerParteien = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'useAggregates': props.useAggregates
            }
        };
        try {
            const response = await fetch(BASE_URL + props.filter + "/wahlkreise/" + props.wahlkreisId + "/gewinnerparteien", requestOptions);
            const jsonData = await response.json();
            setGewinner(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    const updateBeteiligung = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'useAggregates': props.useAggregates
            }
        };
        try {
            const response = await fetch(BASE_URL + props.filter + "/wahlkreise/" + props.wahlkreisId + "/beteiligung", requestOptions);
            const jsonData = await response.json();
            setBeteiligung(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    const updateParteien = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'useAggregates': props.useAggregates
            }
        };
        try {
            const response = await fetch(BASE_URL + props.filter + "/wahlkreise/" + props.wahlkreisId + "/parteiengesamt", requestOptions);
            const jsonData = await response.json();
            setParteien(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    async function fetchData() {
        props.setLoading(true);
        await Promise.all([updateBeteiligung(), updateGewinnerParteien(), updateParteien()]);
        props.setLoading(false);
    }

    useEffect(() => {
        fetchData()
    }, [props.wahlkreisId, props.filter]);


    function getChartData() {
        let aggregatedParteien = [];
        const rest = {
            partei: "other",
            anzahl: 0
        };
        parteien.forEach((p, i) => {
            if (i < 6) {
                aggregatedParteien.push(p)
            } else {
                rest.anzahl += parseInt(p.anzahl)
            }
        });
        aggregatedParteien.push(rest);
        return {
            labels: aggregatedParteien.map(p => p.partei),
            datasets: [
                {
                    label: '# of Votes',
                    data: aggregatedParteien.map(p => parseInt(p.anzahl)),
                    backgroundColor: aggregatedParteien.map(p => getParteiColor(p.partei)),
                    borderWidth: 1,
                },
            ],
        }
    }

    return <div>
        <div className="Title">
            <h1>{props.wahlkreis}</h1>
        </div>


        <div className="Subtitle">
            <h2>Wahlbeteiligung</h2>
        </div>

        <Table striped bordered hover>
            <thead>
            <tr>
                <th scope="col">Wahlberechtigte</th>
                <th scope="col">Wähler</th>
                <th scope="col">Wahlbeteiligung</th>
            </tr>
            </thead>
            <tbody>
            <tr key="beteiligung">
                <td key="beteiligung-1">{beteiligung.wahlberechtigte}</td>
                <td key="beteiligung-2">{beteiligung.waehler}</td>
                <td key="beteiligung-3">{beteiligung.beteiligung}%</td>
            </tr>
            </tbody>
        </Table>


        <div className="Subtitle">
            <h2>Gewinner Parteien</h2>
        </div>

        <Table striped bordered hover size="sm">
            <thead>
            <tr>
                <th scope="col">Partei</th>
                <th scope="col">Gesamtsitze</th>
                <th scope="col">Anzahl Direktmandate</th>
                <th scope="col">Anzahl Überhangsmandate</th>
            </tr>
            </thead>
            <tbody>
            {gewinner.map((gewinner, i) =>
                <tr key={'Gewinner-tr-' + i}>
                    <td key={'Gewinner-td-Vorname-' + i}>{gewinner.partei}</td>
                    <td key={'Gewinner-td-Nachname-' + i}>{gewinner.gesamtsitze}</td>
                    <td key={'Gewinner-td-Partei-' + i}>{gewinner.anzahl_direktmandaten}</td>
                    <td key={'Gewinner-td-Anzahl-' + i}>{gewinner.anzahl_ueberhangsmandate}</td>
                </tr>
            )}
            </tbody>
        </Table>


        <div className="Subtitle">
            <h2>Parteien</h2>
        </div>


        <div className="PieChart">
            <Doughnut data={getChartData()}/>
        </div>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th scope="col">Partei</th>
                <th scope="col">{"Anzahl Gesammtstimmen"}</th>
                <th scope="col">Anteil</th>
            </tr>
            </thead>
            <tbody>
            {parteien.map(partei => (
                <tr key={'sitzverteilung-tr-' + partei.partei}>
                    <td key={'sitzverteilung-td-partei-' + partei.partei}>{partei.partei}</td>
                    <td key={'sitzverteilung-td-sitze-' + partei.partei}>{partei.anzahl}</td>
                    <td key={'sitzverteilung-td-prozent-' + partei.partei}>{partei.prozent}%</td>
                </tr>
            ))}
            </tbody>
        </Table>


    </div>
}
