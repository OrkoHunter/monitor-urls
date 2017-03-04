const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/monitor_urls';

const client = new pg.Client(connectionString);
client.connect();
const query1 = client.query(
  'CREATE TABLE identity(id char (128) PRIMARY KEY, url text NOT NULL)');
query1.on('end', () => { client.end(); });
const query2 = client.query(
  'CREATE TABLE responses(id char (128) PRIMARY KEY, delays text)');
query2.on('end', () => { client.end(); });
