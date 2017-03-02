const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/monitor';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE identity(id char (128) PRIMARY KEY, url text NOT NULL)');
const query = client.query(
  'CREATE TABLE identity(id char (128) PRIMARY KEY, delays text)');
query.on('end', () => { client.end(); });
