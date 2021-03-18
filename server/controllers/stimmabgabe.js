const pool = require("../db");
const CryptoJS = require('crypto-js');

async function vote(req, res) {
    const erststimme = req.body.erststimme;
    const zweitstimme = req.body.zweitstimme;
    const validErst = validErststimme(erststimme);
    const validZweit = await validZweitstimme(zweitstimme);

    if (!validErst && !validZweit) {
        res.status(422).send("Fehler in Erststimme und Zweitstimme.");
    } else if (!validErst) {
        res.status(422).send("Fehler in Erststimme.");
    } else if (!validZweit) {
        res.status(422).send("Fehler in Zweitstimme.");
    } else {
        const landtagswahl = 2018;
        const token = req.headers.token;
        const encryptedToken = CryptoJS.SHA256(token).toString(CryptoJS.enc.Hex);
        const valid = await validateToken(encryptedToken, res);

        if (valid) {
            const stimmkreisId = await getStimmkreisId(encryptedToken);
            if (erststimme !== null) {
                await saveFirstVote(erststimme, landtagswahl, stimmkreisId);
            }
            if (zweitstimme !== null) {
                await saveSecondVote(zweitstimme, landtagswahl, stimmkreisId);
            }
            res.send("Die Stimmabgabe ist erfolgreich abgeschlossen.");
        }
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
            return false;
        }
        tokenData = tokenData[0];
        if(tokenData.hat_gewaehlt) {
            res.status(422).send("Token wurde schon benutzt!");
            return false;
        }
        await pool.query("update validtokens " +
            "set hat_gewaehlt = true " +
            "where token = '" + token + "'");
        return true;
    } catch (err) {
        console.error(err.message);
    }
}

async function saveFirstVote(erststimme, landtagswahl, stimmkreisId) {
    try {
        if (erststimme.ungultig === true) {
            await pool.query("insert into ungultigestimmen(stimmkreis_id, landtagswahl, ist_erststimme) " +
                "values (" + stimmkreisId + ", " + landtagswahl + ", true)");
        } else {
            await pool.query("insert into erststimmen(direktkandidatur_id, elektronische_stimmabgabe) " +
                "values (" + erststimme.kandidatur_id + ", true)");
        }
    } catch (err) {
        console.error(err.message);
    }
}

async function saveSecondVote(zweitstimme, landtagswahl, stimmkreisId) {
    try {
        if (zweitstimme.ungultig === true) {
            await pool.query("insert into ungultigestimmen(stimmkreis_id, landtagswahl, ist_erststimme, elektronische_stimmabgabe) " +
                "values (" + stimmkreisId + ", " + landtagswahl + ", false, true)");
        } else if (zweitstimme.kandidatur_id == null) {
            const parteiId = await partyId(zweitstimme.partei);
            await pool.query("insert into zweitstimmenohnekandidat(partei_id, landtagswahl, stimmkreis_id, elektronische_stimmabgabe) " +
                "values (" + parteiId + ", " + landtagswahl + ", " + stimmkreisId + ", true)");
        } else {
            await pool.query("insert into zweitstimmen(listenkandidatur_id, stimmkreis_id, elektronische_stimmabgabe) " +
                "values (" + zweitstimme.kandidatur_id + ", " + stimmkreisId + ", true)");
        }
    } catch (err) {
        console.error(err.message);
    }
}

async function partyId(name) {
    const id = await pool.query("select p.id " +
        "from parteien p " +
        "where p.name = '" + name + "'");
    return id.rows[0].id;
}

async function getStimmkreisId(token) {
    try {
        let stimmkreis = await pool.query("select t.stimmkreis_id " +
            "from validtokens t " +
            "where t.token = '" + token + "'");
        return stimmkreis.rows[0].stimmkreis_id;
    } catch (err) {
        console.error(err.message);
    }
}

function validErststimme(erstimmen) {
    if (erstimmen == null || erstimmen.ungultig) {
        return true;
    }
    if (erstimmen.kandidatur_id == null || isNaN(erstimmen.kandidatur_id)) {
        return false;
    }
    return true;
}

async function validZweitstimme(zweitstimme) {
    if (zweitstimme == null || zweitstimme.ungultig) {
        return true;
    }
    if(zweitstimme.kandidatur_id == null && zweitstimme.partei == null) {
        return false;
    }
    if(zweitstimme.kandidatur_id != null && isNaN(zweitstimme.kandidatur_id)) {
        return false;
    }
    if (zweitstimme.partei != null && await isNotParty(zweitstimme.partei)) {
        return false;
    }
    return true;
}

async function isNotParty(name) {
    try {
        const parties = await pool.query("SELECT p.name FROM parteien p");
        const partyNames = parties.rows.map(p => { return p.name });
        return !partyNames.includes(name);
    } catch (err) {
        console.error(err.message);
    }
}

module.exports.vote = vote;
