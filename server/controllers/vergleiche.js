const pool = require("../db");
let aggregates = require("../controllers/aggregates");
const fs = require('fs');

async function getStimmkreiseComparison(req, res) {
    try {

        if (isNaN(req.params.id))
            throw new Error("Invalid parameters");

        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            await aggregates.refreshAggregatParteiStimmkreisGesamtstimmen();
        }

        const filePath = "./SQL/Q3/stimmkreiseVergleich.sql";
        const sql = fs.readFileSync(filePath).toString();
        const values = [req.params.id]
        comparison = await pool.query(sql, values);
        res.json(comparison.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function getWahlkreiseComparison(req, res) {
    try {

        if (isNaN(req.params.id))
            throw new Error("Invalid parameters");

        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            await aggregates.refreshAggregatParteienGesamtstimmen();
        }

        const filePath = "./SQL/vergleiche/wahlkreiseVergleich.sql";
        const sql = fs.readFileSync(filePath).toString();
        const values = [req.params.id]
        comparison = await pool.query(sql, values);
        res.json(comparison.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function getGesamtComparison(req, res) {
    try {

        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            await aggregates.refreshAggregatParteienGesamtstimmen();
        }

        const filePath = "./SQL/vergleiche/gesamtVergleich.sql";
        const sql = fs.readFileSync(filePath).toString();
        comparison = await pool.query(sql);
        res.json(comparison.rows);
    } catch (err) {
        console.error(err.message);
    }
}

module.exports.getStimmkreiseComparison = getStimmkreiseComparison;
module.exports.getWahlkreiseComparison = getWahlkreiseComparison;
module.exports.getGesamtComparison = getGesamtComparison;