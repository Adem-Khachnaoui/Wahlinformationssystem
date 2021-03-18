const pool = require("../db");
let aggregates = require("../controllers/aggregates");
const fs = require('fs');

async function get(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year])
            throw new Error("Invalid parameters");

        const stimmkreise = await pool.query("SELECT * " +
                                             "FROM stimmkreise " +
                                             "ORDER BY name");
        res.json(stimmkreise.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function getBeteiligung(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year] || isNaN(req.params.id))
            throw new Error("Invalid parameters");

        const filePath = "./SQL/Q3/beteiligung.sql";
        const sql = fs.readFileSync(filePath).toString();
        const values = [req.params.year, req.params.id]
        const beteiligung = await pool.query(sql, values);

        res.json(beteiligung.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}

async function getWinner(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year] || isNaN(req.params.id))
            throw new Error("Invalid parameters");

        let winner;
        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            const filePath = "./SQL/Q7/gewinnerKandidatenOhneAgg.sql";
            const sql = fs.readFileSync(filePath).toString();
            const values = [req.params.year, req.params.id]
            winner = await pool.query(sql, values);
        } else {
            const filePath = "./SQL/Q3/gewinnerKandidaten.sql";
            const sql = fs.readFileSync(filePath).toString();
            const values = [req.params.year, req.params.id]
            winner = await pool.query(sql, values);
        }

        res.json(winner.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function getPartiesTotal(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year] || isNaN(req.params.id))
            throw new Error("Invalid parameters");

        let parties;
        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            const filePath = "./SQL/Q7/parteienGesamtOhneAgg.sql";
            const sql = fs.readFileSync(filePath).toString();
            const values = [req.params.year, req.params.id]
            parties = await pool.query(sql, values);
        } else {
            const filePath = "./SQL/Q3/parteienGesamt.sql";
            const sql = fs.readFileSync(filePath).toString();
            const values = [req.params.year, req.params.id]
            parties = await pool.query(sql, values);
        }
        res.json(parties.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function getPartiesFirst(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year] || isNaN(req.params.id))
            throw new Error("Invalid parameters");

        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            await aggregates.refreshAggregatKandidatErststimmen();
        }

        const filePath = "./SQL/Q4/siegerParteienErststimme.sql";
        const sql = fs.readFileSync(filePath).toString();
        const values = [req.params.year, req.params.id]
        const parteien = await pool.query(sql, values);

        res.json(parteien.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function getPartiesSecond(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year] || isNaN(req.params.id))
            throw new Error("Invalid parameters");

        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            await aggregates.refreshAggregatParteiZweitstimmen();
        }

        const filePath = "./SQL/Q4/siegerParteienZweitstimme.sql";
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
module.exports.getWinner = getWinner;
module.exports.getPartiesTotal = getPartiesTotal;
module.exports.getPartiesFirst = getPartiesFirst;
module.exports.getPartiesSecond = getPartiesSecond;