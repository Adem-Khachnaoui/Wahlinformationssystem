import Table from "react-bootstrap/Table";
import React from "react";
import {getParteiColor} from "../../utils";
import {Bar} from "react-chartjs-2";


export function ParteienVergleichChart(props) {

    const data = {
        labels: props.parteien.map(p => p.partei),
        datasets: [
            {
                label: 'Veränderung des Anteils in %',
                data: props.parteien.map(p => parseFloat(p.prozent)),
                backgroundColor: props.parteien.map(p => getParteiColor(p.partei)),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        legend: {
            display: false
        },
        scales: {
            yAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: 'Veränderung vom Anteil an Gesamtstimmen in %'
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function (label, index, labels) {
                            return label + '%';
                        }
                    },
                },
            ],
        },
    };

    return (<div>
        <div className="BarChart">
            <Bar data={data} options={options}/>
        </div>

        <Table striped bordered hover>
            <thead>
            <tr>
                <th scope="col">Partei</th>
                <th scope="col">Anzahl Gesamtstimmen 2013</th>
                <th scope="col">Anzahl Gesamtstimmen 2018</th>
                <th scope="col">Veränderung des Anteils in %</th>
            </tr>
            </thead>
            <tbody>
            {props.parteien.map(partei => (
                <tr key={'sitzverteilung-tr-' + partei.partei}>
                    <td key={'sitzverteilung-td-partei-' + partei.partei}>{partei.partei}</td>
                    <td key={'sitzverteilung-td-sitze-' + partei.partei}>{partei.anzahl2013}</td>
                    <td key={'sitzverteilung-td-sitze-' + partei.partei}>{partei.anzahl2018}</td>
                    <td key={'sitzverteilung-td-prozent-' + partei.partei}>
                        <div style={{
                            color: parseFloat(partei.prozent) < 0 ? "red" : "green"
                        }}>{partei.prozent}%
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>

    </div>)
}
