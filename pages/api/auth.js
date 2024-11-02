import { pool } from '../../utils/db'; // Create a `db.js` for the PostgreSQL connection setup.
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const key = process.env.JWT_SECRET;

export default async function handler(req, res) {
  const { username, password } = req.body;

  console.log("Received request:", { username, password });

  if (req.method === 'POST') {
    try {
      const userQuery = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      console.log("User query result:", userQuery.rows);

      const user = userQuery.rows[0];

      if (user) {
        console.log("User found:", user);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (isMatch) {
          const token = jwt.sign({ userId: user.id }, key, { expiresIn: '1h' });
          console.log("JWT Token generated:", token);
          res.status(200).json({ token });
        } else {
          console.log("Invalid credentials: Password does not match");
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } else {
        console.log("Invalid credentials: User not found");
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    console.log("Invalid request method:", req.method);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
