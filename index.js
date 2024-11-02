const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection configuration
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DATABASE || 'product_management',
    password: process.env.POSTGRES_PASSWORD || '1234',
    port: 5432,
});

// Retrieve secret key from environment variables
const key = process.env.JWT_SECRET || '2552035f3df571dd1e0241925fc8dfd722c8b8f21b9df19a21e2e2876ff32b05'; // Set your own secret key for production

// Login route to get a token
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userQuery = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        const user = userQuery.rows[0];
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user.id }, key, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send('Internal Server Error');
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token required');

    jwt.verify(token.split(' ')[1], key, (err, decoded) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = decoded;
        next();
    });
};

// Routes
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/products', async (req, res) => {
    const { name, description, price, quantity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products (name, description, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, quantity]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).send('Bad Request');
    }
});

// Protected routes
app.put('/products/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;
    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *',
            [name, description, price, quantity, id]
        );
        result.rows.length > 0 ? res.json(result.rows[0]) : res.status(404).send('Product not found');
    } catch (error) {
        res.status(400).send('Bad Request');
    }
});

app.delete('/products/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
        result.rowCount > 0 ? res.status(204).send() : res.status(404).send('Product not found');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Export the app for testing
module.exports = app;
