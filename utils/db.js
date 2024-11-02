// db.js
const { Pool } = require('pg');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Configure PostgreSQL connection
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  // Set ssl only in production
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false, // This may be necessary for some cloud providers like Vercel
  } : false, // Disable SSL for local development
});

// Export a query function to be used by other files
module.exports = { pool };
