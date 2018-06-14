const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dynamoDB = require('./dynamoDBConfig').dynamoDB;
const decodeVerifyAndReturnUsername = require('./authenticate').decodeVerifyAndReturnUsername;

const OSRS_TABLE = process.env.OSRS_TABLE;
const inventory = 'inventory';


app.use(bodyParser.json({ strict: false }));

app.post(`/${inventory}`, (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  decodeVerifyAndReturnUsername(req.body.token)
    .then(data => {
      if (req.body.intent === 'put') {
        const params = {
          TableName: OSRS_TABLE,
          Item: {
            cognitoUID: data.username,
            stateName: inventory,
            state: req.body[inventory]
          }
        };
        dynamoDB.put(params, (err, data) => {
          if (err) {
            console.log(err, err.stack);
            res.statusCode = 400;
            res.send(err);
          }
          else {
            res.statusCode = 200;
            res.send(data);
          }
        })
      } else if (req.body.intent === 'get'){
        const params = {
          TableName: OSRS_TABLE,
          Key: {
            cognitoUID: data.username,
            stateName: inventory
          }
        };
        dynamoDB.get(params, (err, data) => {
          if (err) {
            console.log(err, err.stack);
            res.statusCode = 400;
            res.send(err);
          }
          else {
            res.statusCode = 200;
            res.send({inventory: data["Item"]["state"]});
          }
        })
      } else {
        res.statusCode = 400;
        res.send('Unknown "intent" specified.')
      }
    })
    .catch(err => {
      res.statusCode = 400;
      res.send(err)
    });
});


module.exports.handler = serverless(app);


// command to test api: curl -v -H "Content-Type: application/json" -d '{"token": "eyJraWQiOiJxVWdvUG5Pd1VhOWZ0NnhQWVwvd3BHRFhhVWRIZXphZVpFNEhoaEJ6aHVIVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2MTM2YTJlYy04ZGQ3LTRmNjQtYjVjZS1mYzA2ZTc2MjMyYTciLCJhdWQiOiJpdGtuZTk3ZDFnNnVkajQ4OGtqYjllajJiIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiMzM2YmJhNDMtNzAwNy0xMWU4LWJmZDAtM2JlNjI4Nzk2YzZkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1MjkwMDM2ODYsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0tPNXR3N1RSdyIsImNvZ25pdG86dXNlcm5hbWUiOiI2MTM2YTJlYy04ZGQ3LTRmNjQtYjVjZS1mYzA2ZTc2MjMyYTciLCJleHAiOjE1MjkwMDcyODYsImlhdCI6MTUyOTAwMzY4NiwiZW1haWwiOiJkYWx0b24uaGlsbDIwMjJAZ21haWwuY29tIn0.a-tZPat9Cof5hmbInS5-bGSBhMHbBxSjifHOceJ_fSTd_710UWHD3y3GqpOeeawVcV3sXqFk7hKLvbHWr2ujsV4-zWyEMBFLFwRgxkAq3cTZQbWxnzeyfkXg2DP7mihFl08CVqt5wSmSiSuycp50USlCVABwOC7OyOHvi48XOxvltAMQbfIqNM6TahDb6Z3lvls4GxU6LuMMvXaLv5shBgjKjiVHun4HIUjdOoTJKFelropoUMo-1Jej1Orxq_j5flY-_knvFfix8bSOyW6_G0uogNgEQk7ZQuHcd8oEhMRZ5OLIEuuENpMq_rO5Y_mgPv1jigvJ30Nc_IkHzRZw0Q", "inventory": {"items": [], "actions": []}, "intent": "get" }' http://localhost:3000/inventory