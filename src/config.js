require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Nedostaje obavezna varijabla okoline: ${name}`);
  }
  return value;
}

function optional(name, fallback) {
  const value = process.env[name];
  return value === undefined || value === "" ? fallback : value;
}

const config = {
  port: parseInt(optional("PORT", "3000"), 10),
  baseUrl: optional("BASE_URL", "http://localhost").replace(/\/+$/, ""),

  /*db: {
    connectionString: required("DATABASE_URL"),
    ssl:
      optional("DATABASE_SSL", "false") === "true"
        ? { rejectUnauthorized: false }
        : false,
  },*/
};

module.exports = config;
