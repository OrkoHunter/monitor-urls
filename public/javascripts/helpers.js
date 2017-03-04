const request = require('request');
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/monitor_urls';

function monitorUrls() {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return;
    }

    // Query to get
    const query = client.query('SELECT * FROM identity');

    query.on('row', function(row) {
      var start = new Date();
      request(row.url, function (err, res, body) {
        var delay = new Date() - start;
        insertDelyas(row.id, delay);
      });
    });

    query.on('end', function() {
      done();
    });
  });

};


var insertDelyas = function(url_id, delay) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return;
    }
    var delays_string = '';
    const query1 = client.query("SELECT * FROM responses WHERE id=$1;",
      [url_id]);

    query1.on('row', function(row) {
      delays_string = row.delays;
      var delays_arr = delays_string.split(' ');
      delays_arr.unshift(delay)  // Prepends the array
      if (delays_arr.length > 100)
        delays_arr.pop()
      var updated_string = delays_arr.join(' ');

      const query2 = client.query('UPDATE responses SET delays = $2 WHERE id = $1',
        [url_id, updated_string]);

      query2.on('end', function() {
        done();
      });
    });

    query1.on('end', function() {
      done();
    })
  });
};

module.exports = {
  monitorUrls: monitorUrls
};
