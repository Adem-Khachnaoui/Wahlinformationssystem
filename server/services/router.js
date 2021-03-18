const express = require("express");
const router = new express.Router();
const abgeordneten = require("../controllers/abgeordneten");
const gewinnerparteien = require("../controllers/gewinnerparteien");
const stimmkreise = require("../controllers/stimmkreise");
const wahlkreise = require("../controllers/wahlkreise");
const vergleiche = require("../controllers/vergleiche");
const parteien = require("../controllers/parteien");
const analysen = require("../controllers/analysen");
const wahlzettel = require("../controllers/wahlzettel");
const stimmabgabe = require("../controllers/stimmabgabe");
const resetdata = require("../controllers/resetdata");
const refreshdata = require("../controllers/refreshdata");

router.route('/refreshdata')
    .post(refreshdata.refresh);

router.route('/resetdata')
    .post(resetdata.reset);

router.route('/stimmabgabe')
    .post(stimmabgabe.vote);

router.route('/wahlzettel')
    .get(wahlzettel.get);

router.route('/:year/abgeordneten')
    .get(abgeordneten.get);

router.route('/:year/gewinnerparteien')
    .get(gewinnerparteien.get);

router.route('/:year/stimmkreise')
    .get(stimmkreise.get);

router.route('/:year/stimmkreise/:id/beteiligung')
    .get(stimmkreise.getBeteiligung);

router.route('/:year/stimmkreise/:id/gewinner')
    .get(stimmkreise.getWinner);

// Endpoint vergleich must be checked before similar endpoints with year parameter.
router.route('/vergleich/stimmkreise/:id/parteiengesamt')
    .get(vergleiche.getStimmkreiseComparison);

router.route('/vergleich/wahlkreise/:id/parteiengesamt')
    .get(vergleiche.getWahlkreiseComparison);

router.route('/vergleich/parteiengesamt')
    .get(vergleiche.getGesamtComparison);

router.route('/:year/stimmkreise/:id/parteiengesamt')
    .get(stimmkreise.getPartiesTotal);

router.route('/:year/stimmkreise/:id/parteienerststimmen')
    .get(stimmkreise.getPartiesFirst);

router.route('/:year/stimmkreise/:id/parteienzweitstimmen')
    .get(stimmkreise.getPartiesSecond);

router.route('/:year/wahlkreise')
    .get(wahlkreise.get);

router.route('/:year/wahlkreise/:id/beteiligung')
    .get(wahlkreise.getBeteiligung);

router.route('/:year/wahlkreise/:id/gewinnerparteien')
    .get(wahlkreise.getWinnerParties);

router.route('/:year/wahlkreise/:id/parteiengesamt')
    .get(wahlkreise.getPartiesTotal);

router.route('/:year/parteien/:party/knappstesieger')
    .get(parteien.getClosestWinners);

router.route('/:year/parteien/:party/knappsteverlierer')
    .get(parteien.getClosestLosers);

router.route('/parteien')
    .get(parteien.get);

router.route('/:year/analysen/parteien/:party/wohndichte')
    .get(analysen.getDensity);

router.route('/:year/analysen/parteien/:party/einkommen')
    .get(analysen.getIncome);

module.exports = router;