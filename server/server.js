require('dotenv').config();
const express = require('express');
const db = require('../db/index.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const checkId = (req, res, next) => {
  if (isNaN(Number(req.params.id))) {
    res.status(400).send();
  } else {
    next();
  }
};


app.get('/products/:id', checkId, (req, res) => {
  db.getProduct(req.params.id)
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(400).send();
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send();
    });
});

app.get('/styles/:id', checkId, (req, res) => {
  db.getStyles(req.params.id)
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(400).send();
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send();
    })
});

app.get('/related/:id', checkId, (req, res) => {
  db.getRelated(req.params.id)
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(400).send();
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send();
    })
})


app.listen(3300, () => {
  console.log('Listening on port 3300...');
});