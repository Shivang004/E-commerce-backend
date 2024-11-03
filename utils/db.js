const { Pool } = require('pg');

// Use the connection URL if available
const connectionString = process.env.DATABASE_URL || 'postgres://default:6bfw5QPOqxvV@ep-wild-art-a49ivehj.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Necessary for Vercel and some cloud providers
  },
});

module.exports = { pool };
