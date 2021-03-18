const pool = require("../db");
const CryptoJS = require('crypto-js');

async function get(req, res) {
    try {
        const landtagswahl = 2018;
        const token = req.headers.token;
        const encryptedToken = CryptoJS.SHA256(token).toString(CryptoJS.enc.Hex);
        const stimmkreis = await validateToken(encryptedToken, res);
        if (stimmkreis != null) {
            const wahlkreis = await getWahlkreis(stimmkreis.id);
            const direktkandidaten = await getDirektKandidaten(stimmkreis.id, landtagswahl);
            const listenkandidaten = await getListenKandidaten(wahlkreis.id, landtagswahl);
            const result =  {
                landtagswahl: landtagswahl,
                stimmkreis: stimmkreis,
                wahlkreis: wahlkreis,
                direktkandidaten: direktkandidaten,
                listenkandidaten: listenkandidaten
            }
            res.json(result);
        }
    } catch (err) {
        console.error(err.message);
    }
}

async function validateToken(token, res) {
    try {
        let tokenData = await pool.query("select * " +
            "from validtokens t " +
            "where t.token = '" + token + "'");
        tokenData = tokenData.rows;
        if (tokenData.length === 0) {
            res.status(422).send("Token nicht erlaubt!");
            return null;
        }
        tokenData = tokenData[0];
        if(tokenData.hat_gewaehlt) {
            res.status(422).send("Token wurde schon benutzt!");
            return null;
        }
        return getStimmkreis(tokenData.stimmkreis_id);
    } catch (err) {
        console.error(err.message);
    }
}

async function getStimmkreis(stimmkreis) {
    try {
        const stimmkreisData = await pool.query("select s.id, s.name " +
            "from stimmkreise s " +
            "where s.id = '" + stimmkreis + "' ");
        return stimmkreisData.rows[0];
    } catch (err) {
        console.error(err.message);
    }
}

async function getWahlkreis(stimmkreis) {
    try {
        const wahlkreisData = await pool.query("select w.id, w.name " +
            "from stimmkreise s, wahlkreise w " +
            "where s.id = '" + stimmkreis + "' " +
            "and s.wahlkreis_id = w.id");
        return wahlkreisData.rows[0];
    } catch (err) {
        console.error(err.message);
    }
}

async function getDirektKandidaten(stimmkreis, landtagswahl) {
    try {
        const kandidatenData = await pool.query("select dk.id as kandidatur_id, k.vorname, k.nachname, p.name as partei " +
            "from kandidaten k, parteien p, direktkandidaturen dk " +
            "where dk.stimmkreis_id = '" + stimmkreis + "' " +
            "and dk.kandidat_id = k.id " +
            "and dk.partei_id = p.id " +
            "and dk.landtagswahl = " + landtagswahl);
        return kandidatenData.rows;
    } catch (err) {
        console.error(err.message);
    }
}

async function getListenKandidaten(wahlkreis, landtagswahl) {
    try {
        let kandidatenData = await pool.query("select lk.id as kandidatur_id, k.vorname, k.nachname, lk.listenplatz, p.name as partei " +
            "from kandidaten k, parteien p, listenkandidaturen lk " +
            "where lk.wahlkreis_id = '" + wahlkreis + "' " +
            "and lk.kandidat_id = k.id " +
            "and k.partei_id = p.id " +
            "and lk.landtagswahl = " + landtagswahl + " " +
            "order by lk.listenplatz asc");
        const parteien = await pool.query("select distinct p.name as partei " +
            "from kandidaten k, parteien p, listenkandidaturen lk " +
            "where lk.wahlkreis_id = '" + wahlkreis + "' " +
            "and lk.kandidat_id = k.id " +
            "and k.partei_id = p.id " +
            "and lk.landtagswahl = " + landtagswahl);
        kandidatenData = kandidatenData.rows;
        let listenkandidaten = parteien.rows;
        listenkandidaten.forEach(
            function(lk) { return  addListen(lk, kandidatenData); }
        );
        return listenkandidaten;
    } catch (err) {
        console.error(err.message);
    }
}

function addListen(lk, kandidatenData) {
    lk.kandidaten = kandidatenData.filter(
        function(k) { return matchPartei(k, lk.partei); }
    );
}

function matchPartei(kandidat, partei) {
    return kandidat.partei === partei;
}

module.exports.get = get;
