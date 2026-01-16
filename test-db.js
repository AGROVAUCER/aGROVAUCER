const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  const res = await pool.query("select 1 as ok");
  console.log(res.rows);
  process.exit();
})();
