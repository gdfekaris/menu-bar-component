const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
//const url = 'mongodb://54.215.246.57:27017';
const dbName = 'menu-bar-data';
const client = new MongoClient(url, { useNewUrlParser: true });

client.connect(function (err) {
  if (err) { console.log(err) }
  console.log(`Connected to MongoDB`);
});

module.exports.client = client;