const pool = require("../db");
let aggregates = require("../controllers/aggregates");
const fs = require('fs');

async function get(req, res) {
    try {
        const parteien = await pool.query("SELECT * " +
            "FROM parteien");
        res.json(parteien.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function getClosestWinners(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year] || await isNotParty(req.params.party))
            throw new Error("Invalid parameters");

        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            await aggregates.refreshAbgeordneten();
        }

        const filePath = "./SQL/Q6/knappstesieger.sql";
        const sql = fs.readFileSync(filePath).toString();
        const values = [req.params.year, req.params.party]

        const winners = await pool.query(sql, values);

        res.json(winners.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function getClosestLosers(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year] || await isNotParty(req.params.party))
            throw new Error("Invalid parameters");

        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            await aggregates.refreshAbgeordneten();
        }

        const filePath = "./SQL/Q6/knappsteverlierer.sql";
        const sql = fs.readFileSync(filePath).toString();
        const values = [req.params.year, req.params.party]

        const losers = await pool.query(sql, values);

        res.json(losers.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function isNotParty(name) {
    const parties = await pool.query("SELECT p.name FROM parteien p");
    const partyNames = parties.rows.map(p => { return p.name });
    return !partyNames.includes(name);
}

module.exports.get = get;
module.exports.getClosestWinners = getClosestWinners;
module.exports.getClosestLosers = getClosestLosers;