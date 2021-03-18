const express = require("express");
const app = express();
const cors = require("cors");
const router = require('./services/router');
const winston = require('winston');
const expressWinston = require('express-winston');

app.use(cors());
app.use(express.json());

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.json()
    ),
    meta: false,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true
}));

app.use('/api', router);

//Frontend routes
app.use("/", express.static(__dirname + "./../client/build"));
app.use("/ergebnisse", express.static(__dirname + "./../client/build"));
app.use("/stimmabgabe", express.static(__dirname + "./../client/build"));

app.listen(process.env.PORT || 5000, () => {
    console.log("server has started on port " + (process.env.PORT || 5000));
});