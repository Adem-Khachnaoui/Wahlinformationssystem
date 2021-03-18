# Documentation


## Deployment

The website is deployed under the following URL: https://wis.herokuapp.com/


## Project Development Setup

### Database setup

- Download the dump file: https://nextcloud.in.tum.de/index.php/s/RSCwd2CBNrRw8Xq
- Import to Postgres 13.1

### Run application

- Install npm 6.14.4
- Install node 14.2.0
- Install pm2 4.5.2
- Run `npm run build`
- Run `npm start`
- The website is now available under https://localhost:5000/

### Benchmark

#### Our Java Benchmark

- Go to folder `wis/benchmrakClient/src/`
- Run the java file `BenchmarkClient`

#### Jmeter

- Install Jmeter 5.4.1
- Import the [configuration file](https://gitlab.db.in.tum.de/ademkhachnaoui/datenbanksysteme-hechem-adem/-/blob/master/benchmarking/jmeter.jmx).
- Run Jmeter.

## Features


### Statistics

You can access the statistics by clicking on "statistik anzeigen"

We provide three different views:
- Full results of Bayern
- Results per "Wahlkreis"
- Results per "Stimmkreis"

We provide also for each of these view 2 different modes:
- year 2013
- year 2018
- Comparision between 2013 and 2018

Finally, We provide an Analysis mode that shows the variation of the vote results in 2013 and 2018 depending on two parameters:
- Voters' income
- Population density


### Voting

To add a vote, follow th following steps:

- Open the file "./Aufgabenblatt 4/CSVs/validTokens.csv"
- Select a token corresponding to the "stimmkreis_id" you want to submit a vote to
- Click on "Stimme abgeben"
- Use the token to authenticate
- Choose party and candidates
- Submit vote
- The next time you open the statistics, click on reload button on the top right (all views will be updated accordingly).

## Notes

The SQL function for the calculation of the winners of the vote is defined in `Aufgabenblatt 5/zusammensetzung_function.sql`

The SQL code for the queries can be found under  `wis/server/SQL`

The corresponding endpoints are defined in  `wis/server/services/router.js`
