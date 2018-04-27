const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');

const OSRS_TABLE = process.env.OSRS_TABLE;

const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDB;
if (IS_OFFLINE) {
  dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000'});
  console.log(dynamoDB);
} else {
  dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })
}

app.use(bodyParser.json({ strict: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// Get ItemTypes Endpoint
app.get('/:itemType', (req, res) => {
  const params = {
    TableName: OSRS_TABLE,
    KeyConditionExpression: "#itemType = :itemType",
    ExpressionAttributeNames: {
      "#itemType": "itemType"
    },
    ExpressionAttributeValues: {
      ":itemType": req.params.itemType
    }
  };

  dynamoDB.query(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: `Could not get itemType: ${req.params.itemType}`});
    }
    else {
      res.json({ items: result.Items })
    }
  });
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

// Post Item Endpoint
app.post('/:itemType', (req, res) => {
  const { itemType } = req.params;
  const { name, log } = req.body;
  if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string'})
  }

  const params = {
    TableName: OSRS_TABLE,
    Item: {
      itemType: itemType,
      name: name,
      log: log
    },
  };

  dynamoDB.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: `Could not create ${itemType}`});
    }
    res.json({ itemType, name });
  });
});

module.exports.handler = serverless(app);