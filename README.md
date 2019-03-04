# menu-bar-component
This service renders Twitch streamer information. The information includes number of video streamed, and number of followers. It also makes available a list of the followed channels, and renders a sidebar that shows recommended channels.

## Getting Started

### local
- Run `npm install` in the repo directory.

- Run `sudo mongod` in a free terminal pane to start your local MongoDB server.
  (If you don't have MongoDB on your machine, you can install it using a tutorial found [here](https://docs.mongodb.com/manual/installation/#tutorials))

- While your Mongo server is running, use another terminal pane to access the repo directory and run `npm run mongoSeed`
  (This will seed your database with 10 million records. You can monitor progress in the console.)

- Once the seed script is finished, you can run `npm run react-dev` in the repo directory to build the webpack bundle, and then run `npm start` to start the server.

- Access the service @ `http://localhost:3015`. It will take about 10 seconds to load, since it it not optimized yet.

### EC2
- Spin up 2 instances: one for the menu-bar-component, and one for the DBMS.

- On the DBMS instance, install MongoDB using [these instructions](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-amazon/#install-mongodb-community-edition).

- Configure MongoDB's IP binding by running `sudo nano /etc/mongod.conf`. Find the `net` configuration and comment out the `bindIp` line. It should look like this:
```
# network interfaces
net:
  port: 27017
#  bindIp: 127.0.0.1  <- comment out this line
```

- If you want to set up authorization for connecting to the db, checkout [this](https://ianlondon.github.io/blog/mongodb-auth/). Remember that setting up authorization will require adding lines of code to `MongoDB/seedScript.js` and `MongoDB/index.js`.

- Run `sudo service mongod restart` to make the changes take effect.

- Now, on the menu-bar-service instance, install Node.js using [these instructions](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html). Note: the `.nvmrc` file in this repo has the suggested Node version to install with NVM.

- Clone this repo to the menu-bar-service instance.

- Enter the repo and run `rm package-lock.json`.

- Run `npm install`.

- Run `nano MongoDB/seedScript.js` and change the IP and Port on line 4 to match your MongoDB EC2 instance. Run `nano MongoDB/index.js` and do the same thing again on line 4.

- Run `npm run mongoSeed`. This will take a while.

- Now start the menu-bar-component service by running `node server/index.js > stdout.txt 2> stderr.txt &`.

- Use `cat stdout.txt` and `cat stderr.txt` to check logs and errors.

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
