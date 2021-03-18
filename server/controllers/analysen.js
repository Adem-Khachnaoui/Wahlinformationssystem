const pool = require("../db");
let aggregates = require("../controllers/aggregates");
const fs = require('fs');

async function getDensity(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year] || await isNotParty(req.params.party))
            throw new Error("Invalid parameters");

        const filePath = "./SQL/analysen/density.sql";

        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            await aggregates.refreshAggregatParteiStimmkreisGesamtstimmen();
        }

        const sql = fs.readFileSync(filePath).toString();
        const values = [req.params.year, req.params.party]

        const densities = await pool.query(sql, values);

        res.json(densities.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function getIncome(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year] || await isNotParty(req.params.party))
            throw new Error("Invalid parameters");

        const filePath = "./SQL/analysen/income.sql";

        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            await aggregates.refreshAggregatParteiStimmkreisGesamtstimmen();
        }

        const sql = fs.readFileSync(filePath).toString();
        const values = [req.params.year, req.params.party]

        const incomes = await pool.query(sql, values);

        res.json(incomes.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function isNotParty(name) {
    const parties = await pool.query("SELECT p.name FROM parteien p");
    const partyNames = parties.rows.map(p => { return p.name });
    return !partyNames.includes(name);
}

module.exports.getDensity = getDensity;
module.exports.getIncome = getIncome;