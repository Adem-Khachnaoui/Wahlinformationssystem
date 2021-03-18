import {ParteienVergleichChart} from "./ParteienVergleichChart";
import React, {useEffect, useState} from "react";
import {BASE_URL} from "../../App";


export function VergleichWahlkreis(props) {

    const [parteien, setParteien] = useState([
            {partei: "", anzahl2013: 0, anzahl2018: 0, prozent: 0}
        ]
    );

    const updateParteien = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'useAggregates': props.useAggregates
            }
        };
        try {
            const response = await fetch(BASE_URL + "vergleich/wahlkreise/" + props.wahlkreisId + "/parteiengesamt", requestOptions);
            const jsonData = await response.json();
            setParteien(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    async function fetchData() {
        props.setLoading(true);
        await updateParteien();
        props.setLoading(false);
    }

    useEffect(() => {
        fetchData()
    }, [props.wahlkreisId]);


    return <div>
        <div className="Title">
            <h1>{props.wahlkreis}</h1>
        </div>

        <ParteienVergleichChart parteien={parteien}/>
    </div>
}
