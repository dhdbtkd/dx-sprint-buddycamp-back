var express = require('express');
const { Client } = require('pg');
var router = express.Router();

const dbClient = new Client({
  user: process.env.POSTGRESQL_USER,
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DATABASE,
  password: process.env.POSTGRESQL_PASSWORD,
  port: process.env.POSTGRESQL_PORT
});
dbClient.connect();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.send('respond with a resource');
  dbClient.query("SELECT * FROM user", (error, result) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.status(200).json(result.rows);
    }
  })
});

module.exports = router;
