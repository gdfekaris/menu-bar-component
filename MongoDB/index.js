const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
//const url = 'mongodb://172.31.2.0:27017';
//const url = 'mongodb://54.67.109.46:27017';
const client = new MongoClient(url, { useNewUrlParser: true });

client.connect(function (err) {
  if (err) { console.log(err) }
  console.log(`Connected to MongoDB`);
});

module.exports.client = client;
