require('newrelic');

const MongoClient = require('mongodb').MongoClient;
//var mongo;
//const url = 'mongodb://localhost:27017'; /* Local */
const url = 'mongodb://172.31.2.0:27017'; /* Internal EC2 IP */
//const url = 'mongodb://54.67.109.46:27017'; /* Public EC2 IP */
//const MongoDB = new MongoClient(url, { useNewUrlParser: true, poolSize: 50, reconnectTries: Number.MAX_VALUE, autoReconnect: true });

let mongo = MongoClient.connect(url, {
  useNewUrlParser: true,
  poolSize: 5000,
  reconnectTries: Number.MAX_VALUE,
  autoReconnect: true
},
  function (err, db) {
    //assert.equal(null, err);
    if (err) {
      console.log(err)
    } else {
      mongo = db;
      console.log('Connected to MongoDB');
    }
  })

const cluster = require('cluster')
const { cpus } = require('os')
//const log = require('./modules/log')

const isMaster = cluster.isMaster
const numWorkers = cpus().length

if (isMaster) {

  console.log(`Forking ${numWorkers} workers`)
  const workers = [...Array(numWorkers)].map(_ => cluster.fork())

  cluster.on('online', (worker) => console.log(`Worker ${worker.process.pid} is online`))
  cluster.on('exit', (worker, exitCode) => {
    console.log(`Worker ${worker.process.id} exited with code ${exitCode}`)
    console.log(`Starting a new worker`)
    cluster.fork()
  })

} else {


const port = 3015 || process.env.PORT;
const assert = require('assert');
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
// const mongo = require('../MongoDB/index.js');
// const db = mongo.db(`menu-bar-data`);
// const users = db.collection(`users`);

app.use(helmet());

app.use(express.static(__dirname + '/../public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/username', (req, res) => {
  const db = mongo.db(`menu-bar-data`);
  const users = db.collection(`users`);
  new Promise((resolve, reject) => {
    users.find({ _id: { $gt: 9999900 } }) /* find({}, { "limit": 100, "skip": 9999900 }) */
      .toArray((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).end();
        } else {
          resolve(docs);
        }
      })
  })
    .then((data) => res.status(200).send(JSON.stringify(data)))
    .then(() => console.log('GET API complete'));


  // mongo.client.connect((err) => {
  //   const db = mongo.client.db(`menu-bar-data`);
  //   const users = db.collection(`users`);
  //   if (err) {
  //     console.log(err);
  //     res.status(500).end();
  //   } else {
  //     console.log('GET api called')
  //   }

  //   new Promise((resolve, reject) => {
  //     users.find({ _id: { $gt: 9999900 } }) /* find({}, { "limit": 100, "skip": 9999900 }) */
  //     .toArray((err, docs) => {
  //       if (err) {
  //         console.log(err);
  //         res.status(500).end();
  //       } else {
  //         resolve(docs);
  //       }
  //     })
  //   })
  //   .then((data) => res.status(200).send(JSON.stringify(data)))
  //     .then(() => console.log('GET API complete'));
  // })
});

// app.post(`/createProfile`, (req, res) => {
//   mongo.client.connect((err) => {
//     const db = mongo.client.db(`menu-bar-data`);
//     const users = db.collection(`users`);
//     if (err) {
//       console.log(err);
//       res.status(500).end();
//     } else {
//       console.log('POST api called')
//     }

//     new Promise((resolve, reject) => {
//       users.insertOne(req.body, (err, r) => {
//         assert.equal(null, err);
//         resolve(assert.equal(1, r.insertedCount));
//       })
//     })
//       .then(() => res.status(200))
//       .then(() => mongo.client.close(console.log('POST API complete')));
//   })
// })

// app.delete(`/deleteProfile`, (req, res) => {
//   mongo.client.connect((err) => {
//     const db = mongo.client.db(`menu-bar-data`);
//     const users = db.collection(`users`);
//     if (err) {
//       console.log(err);
//       res.status(500).end();
//     } else {
//       console.log('DELETE api called')
//     }

//     new Promise((resolve, reject) => {
//       users.deleteOne(req.body);
//       resolve(e);
//     })
//       .then((e) => { console.log(e); })
//       .then(() => res.status(200))
//       .then(() => mongo.client.close(console.log('DELETE API complete')));
//   })
// })

// app.put(`/updateProfile`, (req, res) => {
//   mongo.client.connect((err) => {
//     const db = mongo.client.db(`menu-bar-data`);
//     const users = db.collection(`users`);
//     if (err) {
//       console.log(err);
//       res.status(500).end();
//     } else {
//       console.log('PUT api called')
//     }

//     new Promise((resolve, reject) => {
//       users.updateOne(req.body.user_id, { $set: req.body.update });
//       resolve(e);
//     })
//       .then((e) => { console.log(e); })
//       .then(() => res.status(200))
//       .then(() => mongo.client.close(console.log('PUT API complete')));
//   })
// })

app.listen(port, () => console.log(`Menu Bar server listening on port ${port}!`));

}




/* Extra code -- lines from original file

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

*/
