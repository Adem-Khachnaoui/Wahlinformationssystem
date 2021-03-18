const pool = require("../db");
let aggregates = require("../controllers/aggregates");
const fs = require('fs');

async function get(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year])
            throw new Error("Invalid parameters");
        const wahlkreise = await pool.query("SELECT * " +
                                            "FROM wahlkreise " +
                                            "ORDER BY name");
        res.json(wahlkreise.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function getBeteiligung(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year] || isNaN(req.params.id))
            throw new Error("Invalid parameters");

        const filePath = "./SQL/wahlkreise/wahlkreisBeteiligung.sql";
        const sql = fs.readFileSync(filePath).toString();
        const values = [req.params.year, req.params.id]
        const beteiligung = await pool.query(sql, values);

        res.json(beteiligung.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}

async function getWinnerParties(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year] || isNaN(req.params.id))
            throw new Error("Invalid parameters");

        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            await aggregates.refreshAbgeordneten();
            await pool.query("REFRESH MATERIALIZED VIEW ueberhangmandate;");
        }

        const filePath = "./SQL/Q5/wahlkreisGewinnerUberhang.sql";
        const sql = fs.readFileSync(filePath).toString();
        const values = [req.params.year, req.params.id]
        const winnerParties = await pool.query(sql, values);

        res.json(winnerParties.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function getPartiesTotal(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year] || isNaN(req.params.id))
            throw new Error("Invalid parameters");

        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            await aggregates.refreshAggregatParteienGesamtstimmen();
        }

        const filePath = "./SQL/wahlkreise/wahlkreisParteienGesamt.sql";
        const sql = fs.readFileSync(filePath).toString();
        const values = [req.params.year, req.params.id]
        const parteien = await pool.query(sql, values);

        res.json(parteien.rows);
    } catch (err) {
        console.error(err.message);
    }
}

module.exports.get = get;
module.exports.getBeteiligung = getBeteiligung;
module.exports.getWinnerParties = getWinnerParties;
module.exports.getPartiesTotal = getPartiesTotal;