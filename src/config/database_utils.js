const pool = require('./database');

async function get_query_database(query, params) {
  try {
    const [results] = await pool.query(query, params);
    return results;
  } catch (err) {
    throw new Error(`Error executing query: ${query}. ${err.message}`);
  }
}

async function post_query_database(query, params, success_message = "Posted data Successfully") {
  try {
    const [results] = await pool.query(query, params);
    return success_message;
  } catch (err) {
    throw new Error(`Error executing query: ${query}. ${err.message}`);
  }
}

module.exports = { get_query_database, post_query_database };