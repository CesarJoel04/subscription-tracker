import { Router } from 'express';
import pool from '../config/db.js';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM users');
        res.json(results);
    } catch (error) {
        console.error('Error fetching users:', error);
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
        console.error(`Error fetching user ${id}:`, error);
        res.status(500).json({ error: error.message });
    }
});

userRouter.post('/', async (req, res) => {
    let { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    // Trim the inputs
    name = name.trim();
    email = email.trim();

    try {
        const [results] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        res.status(201).json({ id: results.insertId, name, email });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: error.message });
    }
});

userRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    let { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }
    
    // Trim the inputs
    name = name.trim();
    email = email.trim();

    try {
        const [results] = await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ id, name, email, message: 'User updated successfully' });
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
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
        console.error(`Error deleting user ${id}:`, error);
        res.status(500).json({ error: error.message });
    }
});

export default userRouter;