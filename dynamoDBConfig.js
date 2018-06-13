const IS_OFFLINE = process.env.IS_OFFLINE;
const AWS = require('aws-sdk');

let dynamoDB;

if (IS_OFFLINE) {
  dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000'});
} else {
  dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })
}


module.exports.dynamoDB = dynamoDB;