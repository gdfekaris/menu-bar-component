# menu-bar-component
This service renders Twitch streamer information. The information includes number of video streamed, and number of followers. It also makes available a list of the followed channels, and renders a sidebar that shows recommended channels.

<!-- ## Getting Started


### local

### EC2 -->


## Routes:

### /getProfile

- Queries database for last 100 records of user profiles
- Takes no request parameters

```javascript
app.get('/getProfile', (req, res) => {
  mongo.client.connect((err) => {
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
```

### /createProfile

- Posts a new user profile to database
- Request body key-value pairs mirror user profile schema

```javascript
app.post(`/createProfile`, (req, res) => {
  mongo.client.connect((err) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      console.log('POST api called')
    }

    new Promise((resolve, reject) => {
      users.insertOne(req.body, (err, r) => {
        assert.equal(null, err);
        resolve(assert.equal(1, r.insertedCount));
      })
    })
      .then(() => res.status(200))
      .then(() => console.log('POST API complete'));
  })
})
```

### /deleteProfile

- Deletes user profile from database
- Takes key-value pair. Possible keys are: `user_id` and `display_name`.

```javascript
app.delete(`/deleteProfile`, (req, res) => {
  mongo.client.connect((err) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      console.log('DELETE api called')
    }

    new Promise((resolve, reject) => {
      users.deleteOne(req.body);
      resolve(e);
    })
      .then((e) => { console.log(e); })
      .then(() => res.status(200))
      .then(() => console.log('DELETE API complete'));
  })
})
```

### /updateProfile

- Replaces current user profile values with new ones.
- Requires `user_id` key-value pair.
- All other key-value pairs from user profile schema may be updated/changed.

```javascript
app.put(`/updateProfile`, (req, res) => {
  mongo.client.connect((err) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      console.log('PUT api called')
    }

    new Promise((resolve, reject) => {
      users.updateOne(req.body.user_id, { $set: req.body.update });
      resolve(e);
    })
      .then((e) => { console.log(e); })
      .then(() => res.status(200))
      .then(() => console.log('PUT API complete'));
  })
})
```
