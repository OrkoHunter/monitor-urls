const express = require('express');
const router = express.Router();
const pg = require('pg');
const crypto = require('crypto');
const path = require('path');
const http = require('http');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/monitor_urls';

/* GET home page. */
router.get('/', function(req, res, next) {
  setInterval(monitorUrl, 1000);
  res.render('index', { title: 'Express' });
});

router.post('/add', function(req, res, next) {
  const results = [];
  var url_id = crypto.randomBytes(64).toString('hex');  // 64 creates hex of 128
  const data = {url: req.body.url, id: url_id}

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500)
        .json({success: false, data: err});
    }

    // Query to insert
    client.query('INSERT INTO identity(id, url) values($1, $2)',
      [data.id, data.url]);

    results.push(data.id);

    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

router.get('/response', function(req, res, next) {
  const results = [];
});

function monitorUrl() {
  console.log(url);
};


module.exports = router;
