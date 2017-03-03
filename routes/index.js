const express = require('express');
const router = express.Router();
const pg = require('pg');
const crypto = require('crypto');
const path = require('path');
const http = require('http');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/monitor_urls';

/* GET home page. */
router.get('/', function(req, res, next) {
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
    const query = client.query('INSERT INTO identity(id, url) values($1, $2)',
      [data.id, data.url]);

    const query2 = client.query('INSERT INTO responses(id, delays) values($1, $2)',
      [data.id, '']);

    results.push(data.id);

    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

router.post('/responses', function(req, res, next) {
  url_id = req.body.id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500)
        .json({success: false, data: err});
    }

    // Query to select
    const query = client.query('SELECT * FROM responses WHERE id=$1;',
      [url_id]);

    query.on('row', function(row) {
      results = row.delays.split(' ');
      return res.status(200)
        .json(results);
    });
  });

});

router.post('/edit', function(req, res, next) {
  url_id = req.body.id;
  new_url = req.body.url;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500)
        .json({success: false, data: err});
    }

    // Query to update
    const query = client.query('UPDATE identity SET url = $2 WHERE id=$1;',
      [url_id, new_url]);

    query.on('end', function() {
      done();
      return res.status(200)
        .json({success: true});
    });
  });
});


router.post('/stop', function(req, res, next) {
  url_id = req.body.id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500)
        .json({success: false, data: err});
    }

    // Query to delete
    const query1 = client.query('DELETE FROM identity WHERE id = $1',
      [url_id]);

    const query2 = client.query('DELETE FROM responses WHERE id = $1',
      [url_id]);

    query2.on('end', function() {
      done();
      return res.status(200)
        .json({success: true});
    });
  });
});


module.exports = router;
