import { Router } from 'express';
import pool from '../config/db.js';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM users');
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRouter.post('/', async (req, res) => {
    const { name, email } = req.body;
    try {
        const [results] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        res.status(201).json({ id: results.insertId, name, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const [results] = await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default userRouter;