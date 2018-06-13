const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dynamoDB = require('./dynamoDBConfig').dynamoDB;
const decodeVerifyAndReturnUsername = require('./authenticate').decodeVerifyAndReturnUsername;

const OSRS_TABLE = process.env.OSRS_TABLE;


app.use(bodyParser.json({ strict: false }));





app.post('/inventory', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log(req.body.token);
  decodeVerifyAndReturnUsername(req.body.token)
    .then(data => res.send(data))
    .catch(err => res.send(err));
});


module.exports.handler = serverless(app);