const port = 443 || process.env.PORT;
const assert = require('assert');
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const mongo = require('../MongoDB/index.js');

app.use(helmet());

app.use(express.static(__dirname + '/../public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/username', (req, res) => {
  mongo.client.connect((err) => {
    const db = mongo.client.db(`menu-bar-data`);
    const users = db.collection(`users`);
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      console.log('GET api called')
    }

    new Promise((resolve, reject) => {
      users.find({}, { "limit": 100, "skip": 9999900 })
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
  })
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




/* Extra code -- lines from original file

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

*/
