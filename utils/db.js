// db.js
const { Pool } = require('pg');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Configure PostgreSQL connection
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432 || process.env.PG_PORT,
  // Set ssl only in production
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false, // This may be necessary for some cloud providers like Vercel
  } : false, // Disable SSL for local development
});

// Export a query function to be used by other files
module.exports = { pool };
