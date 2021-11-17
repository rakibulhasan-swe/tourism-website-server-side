const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const port = process.env.PORT || 4000;
require("dotenv").config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.njyko.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

MongoClient.connect(uri, function (err, client) {
  const db = client.db(`${process.env.DATABASE_NAME}`);

  //order router
  app.get("/order", (req, res) => {
    db.collection("order")
      .find({})
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.delete("/order", (req, res) => {
    const id = req.body.id;
    db.collection("order")
      .deleteOne({ _id: ObjectId(id) })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => console.log(err));
    res.send("delect");
  });

  app.put("/order/:value/:id", (req, res) => {
    const value = req.params.value;
    const id = req.params.id;
    db.collection("order")
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            status: value,
          },
        }
      )
      .then((result) => {
        res.send(result);
      })
      .catch((err) => console.log(err));
  });

  app.post("/order", (req, res) => {
    const data = req.body;
    db.collection("order")
      .insertOne(data)
      .then(function (result) {
        res.send(result);
      })
      .catch((err) => console.log(err));
  });

  //services router
  app.get("/service/:id", (req, res) => {
    const id = req.params.id;
    db.collection("service")
      .find({ _id: ObjectId(id) })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/service", (req, res) => {
    db.collection("service")
      .find({})
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/service", (req, res) => {
    const data = req.body;
    db.collection("service")
      .insertOne(data)
      .then(function (result) {
        console.log(result);
      });
    console.log(data);
    res.send(true);
  });

  if (err) throw err;
  console.log("Database connect...");
  //   db.close();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
