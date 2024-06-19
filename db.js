const { Pool } = require('pg');

const pool = new Pool({
  user: 'maryliag',
  password: 'admin',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'maryliag'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};