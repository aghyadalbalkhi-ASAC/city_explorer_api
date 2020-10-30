let pg = require('pg');
console.log('here clien');
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);

module.exports = client;
