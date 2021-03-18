const pool = require("../db");

async function refreshAbgeordneten() {
    await refreshAggregatParteienGesamtstimmen();
    await pool.query("REFRESH MATERIALIZED VIEW abgeordneten;");
}

async function refreshAggregatKandidatErststimmen() {
    await pool.query("REFRESH MATERIALIZED VIEW aggregat_kandidat_erststimmen;");
}

async function refreshAggregatKandidatZweitstimmen() {
    await pool.query("REFRESH MATERIALIZED VIEW aggregat_kandidat_zweitstimmen;");
}

async function refreshAggregatParteiZweitstimmen() {
    await refreshAggregatKandidatZweitstimmen();
    await pool.query("REFRESH MATERIALIZED VIEW aggregat_partei_zweitstimmen;");
}

async function refreshAggregatParteienGesamtstimmen() {
    await refreshAggregatParteiZweitstimmen();
    await refreshAggregatKandidatErststimmen();
    await pool.query("REFRESH MATERIALIZED VIEW aggregat_partei_gesamtstimmen;");
}

async function refreshAggregatParteiStimmkreisGesamtstimmen() {
    await refreshAggregatKandidatErststimmen();
    await pool.query("REFRESH MATERIALIZED VIEW aggregat_partei_stimmkreis_gesamtstimmen;");
}

async function refreshAggregatParteiStimmkreisZweitstimmen() {
    await pool.query("REFRESH MATERIALIZED VIEW aggregat_partei_stimmkreis_zweitstimmen;");
}

module.exports.refreshAbgeordneten = refreshAbgeordneten;
module.exports.refreshAggregatKandidatErststimmen = refreshAggregatKandidatErststimmen;
module.exports.refreshAggregatKandidatZweitstimmen = refreshAggregatKandidatZweitstimmen;
module.exports.refreshAggregatParteienGesamtstimmen = refreshAggregatParteienGesamtstimmen;
module.exports.refreshAggregatParteiZweitstimmen = refreshAggregatParteiZweitstimmen;
module.exports.refreshAggregatParteiStimmkreisGesamtstimmen = refreshAggregatParteiStimmkreisGesamtstimmen;
module.exports.refreshAggregatParteiStimmkreisZweitstimmen = refreshAggregatParteiStimmkreisZweitstimmen;
