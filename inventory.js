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
            res.send(data.item.state);
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


// command to test api: curl -v -H "Content-Type: application/json" -d '{"token": "eyJraWQiOiJxVWdvUG5Pd1VhOWZ0NnhQWVwvd3BHRFhhVWRIZXphZVpFNEhoaEJ6aHVIVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2MTM2YTJlYy04ZGQ3LTRmNjQtYjVjZS1mYzA2ZTc2MjMyYTciLCJhdWQiOiJpdGtuZTk3ZDFnNnVkajQ4OGtqYjllajJiIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiMmJjNzBmYzgtNmZlNS0xMWU4LTgyYjMtNDc0OTUxMjNiMWUyIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1Mjg5ODkwNzAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0tPNXR3N1RSdyIsImNvZ25pdG86dXNlcm5hbWUiOiI2MTM2YTJlYy04ZGQ3LTRmNjQtYjVjZS1mYzA2ZTc2MjMyYTciLCJleHAiOjE1Mjg5OTI2NzAsImlhdCI6MTUyODk4OTA3MCwiZW1haWwiOiJkYWx0b24uaGlsbDIwMjJAZ21haWwuY29tIn0.XXXLUiVA4QY-Ctgpir-o-AIZdalb4ZuhQK1VrG5e7tBmjESPMFTxAhzctYHdmiSN0eSuppjLYxiZj3p4b936OO_aZ6b9TIRnSahQPrq5E0RLGVFM2j8UnjxsIgwzp5ZkJi3PzXOMp5a96oQ2qT_m6vsnMlVBIqvvs4fJWxyr1INhECAIi2cWlNGJbmUtIvivTg2Od7ivfQ8_ZY3VXVWpoHFMU2xriUInaYQX9_1N0Hqfwe8cLGzK2nnKcx83yvxraoW0pHYzZcfDkU0hIIwLVp1DD3zGP4tCOAvB_kDkkW7Oijcpm7qvLCcxV6SFxMy9Mk0bAsjKsqDfQzHxr3S0Ig", "inventory": {"items": [], "actions": []}, "intent": "get" }' http://localhost:3000/inventory