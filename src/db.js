const { Pool } = require("pg");
const crypto = require("crypto");
const config = require("./config");

const pool = new Pool({
  connectionString: config.db.connectionString,
  ssl: config.db.ssl,
});

async function isTaken(username) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  return rows.length ? true : false;
}

async function createUser(username, password, hashed) {
  if (hashed) {
    password = crypto.createHash("sha256").update(password).digest("hex");
  }
  const { rows } = await pool.query(
    `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username, password;`,
    [username, password],
  );
  return rows[0];
}

async function getPassword(username) {
  const { rows } = await pool.query(
    `SELECT password FROM users WHERE username = $1`,
    [username],
  );
  return rows[0]?.password;
}

async function getComments() {
  const { rows } = await pool.query(
    `SELECT comment FROM comments ORDER BY created_at ASC LIMIT 25;`,
  );
  return rows;
}

async function addComment(comment) {
  await pool.query(`INSERT INTO comments (comment) VALUES ($1)`, [comment]);
}
module.exports = { isTaken, createUser, getPassword, getComments, addComment };
