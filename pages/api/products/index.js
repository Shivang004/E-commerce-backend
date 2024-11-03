import { pool } from '../../../utils/db'; // Adjust the path according to your structure
import jwt from 'jsonwebtoken';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const key = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token required' });

  jwt.verify(token.split(' ')[1], key, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

export default async function handler(req, res) {
  const { method } = req;
  if (method === 'GET') {
    // Fetch all products
    try {
      const result = await pool.query('SELECT * FROM products');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (method === 'POST') {
    // Create a new product
    verifyToken(req, res, async () => {
      const { name, description, price, quantity } = req.body;
      try {
        const result = await pool.query(
          'INSERT INTO products (name, description, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
          [name, description, price, quantity]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ error: 'Bad Request' });
      }
    });
  }  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

