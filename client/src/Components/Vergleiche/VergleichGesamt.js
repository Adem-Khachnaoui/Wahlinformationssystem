import {ParteienVergleichChart} from "./ParteienVergleichChart";
import React, {useEffect, useState} from "react";
import {BASE_URL} from "../../App";


export function VergleichGesamt(props) {

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
            const response = await fetch(BASE_URL + "vergleich/parteiengesamt", requestOptions);
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
    }, []);


    return <div>
        <div className="Title">
            <h1>Vergleich der Gesamtstimmen zwischen 2013 und 2018</h1>
        </div>

        <ParteienVergleichChart parteien={parteien}/>
    </div>
}
