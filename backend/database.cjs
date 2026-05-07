const provider = process.env.DATABASE_PROVIDER || "sqlite";

if (provider === "postgres") {
  module.exports = require("./db-postgres.cjs");
} else {
  module.exports = require("./db.cjs");
}
