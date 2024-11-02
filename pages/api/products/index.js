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
  const { id } = req.query; // Get the product ID from the query

  if (method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (method === 'PUT') {
    verifyToken(req, res, async () => {
      const { name, description, price, quantity } = req.body;
      try {
        const result = await pool.query(
          'UPDATE products SET name = $1, description = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *',
          [name, description, price, quantity, id]
        );
        if (result.rows.length > 0) {
          res.status(200).json(result.rows[0]);
        } else {
          res.status(404).json({ error: 'Product not found' });
        }
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(400).json({ error: 'Bad Request' });
      }
    });
  } else if (method === 'DELETE') {
    verifyToken(req, res, async () => {
      try {
        const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
        if (result.rowCount > 0) {
          res.status(204).send(); // No content
        } else {
          res.status(404).json({ error: 'Product not found' });
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

