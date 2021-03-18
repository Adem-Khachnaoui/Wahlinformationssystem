const pool = require("../db");
const fs = require('fs');
let aggregates = require("../controllers/aggregates");

async function getRefreshRequired() {
    const filePath = "./SQL/refreshRequired.sql";
    const sql = fs.readFileSync(filePath).toString();
    const res = await pool.query(sql);
    return res.rows[0].refreshrequired;
}

async function refresh(req, res){
    try {
        if (await getRefreshRequired()) {
            await doRefresh();
        }
        res.send("Die Aktualisierung ist fertig.");
    } catch (err) {
        console.error(err.message);
    }
}

async function doRefresh() {
    try {
        await Promise.all([pool.query("REFRESH MATERIALIZED VIEW aggregat_kandidat_erststimmen;"),
                          pool.query("REFRESH MATERIALIZED VIEW aggregat_kandidat_zweitstimmen;"),
                          pool.query("REFRESH MATERIALIZED VIEW aggregat_partei_stimmkreis_zweitstimmen;")]);
        await Promise.all([pool.query("REFRESH MATERIALIZED VIEW aggregat_partei_stimmkreis_gesamtstimmen;"),
                          pool.query("REFRESH MATERIALIZED VIEW aggregat_partei_zweitstimmen;")]);
        await pool.query("REFRESH MATERIALIZED VIEW aggregat_partei_gesamtstimmen;");
        await pool.query("REFRESH MATERIALIZED VIEW abgeordneten;");
        await pool.query("REFRESH MATERIALIZED VIEW ueberhangmandate;");
    } catch (err) {
        console.error(err.message);
    }
}

module.exports.refresh = refresh;
module.exports.doRefresh = doRefresh;