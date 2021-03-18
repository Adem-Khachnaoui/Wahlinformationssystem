const pool = require("../db");
let refresh = require("../controllers/refreshdata");

async function reset(req, res){
    await pool.query("delete from erststimmen " +
        "where elektronische_stimmabgabe = true");
    await pool.query("delete from zweitstimmen " +
        "where elektronische_stimmabgabe = true");
    await pool.query("delete from zweitstimmenohnekandidat " +
        "where elektronische_stimmabgabe = true");
    await pool.query("delete from ungultigestimmen " +
        "where elektronische_stimmabgabe = true");
    await pool.query("update validtokens " +
        "set hat_gewaehlt = false");
    await refresh.doRefresh();
    res.send("Das Zurücksetzen ist fertig.");
}

module.exports.reset = reset;
