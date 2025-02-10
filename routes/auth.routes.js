import { Router } from 'express';
import pool from '../config/db.js';

const authRouter = Router();

authRouter.post('/sign-up', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Insert new user (consider hashing password in a real app)
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        res.status(201).json({ id: result.insertId, name, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

authRouter.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;
    try {
        // For production, compare hashed passwords
        const [results] = await pool.query(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Sign in successful', user: results[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

authRouter.post('/sign-out', (req, res) => 
    res.send({ title: 'Sign out' })
);

export default authRouter;