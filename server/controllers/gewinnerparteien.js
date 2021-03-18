const pool = require("../db");
let aggregates = require("../controllers/aggregates");
const fs = require('fs');

async function get(req, res) {
    try {
        let years = {"2013": 2013, "2018": 2018};
        if (!years[req.params.year])
            throw new Error();

        const useAggregates = req.headers.useaggregates;
        if(useAggregates === "false") {
            await aggregates.refreshAbgeordneten();
        }

        const filePath = "./SQL/Q1/sitzverteilung.sql";
        const sql = fs.readFileSync(filePath).toString();
        const values = [req.params.year]
        const gewinner = await pool.query(sql, values);

        res.json(gewinner.rows);
    } catch (err) {
        console.error(err.message);
    }
}

module.exports.get = get;