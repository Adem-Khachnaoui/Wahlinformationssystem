const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.user || "postgres",
    password: process.env.password || "admin",
    host: process.env.host || "localhost",
    port: process.env.db_port || 5432,
    database: process.env.database || "WIS1"
});

module.exports = pool;
