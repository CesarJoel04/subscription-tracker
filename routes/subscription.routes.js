import { Router } from 'express';
import pool from '../config/db.js';

const subscriptionRouter = Router();

// GET all subscriptions
subscriptionRouter.get('/', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM subscriptions');
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET subscription details by id
subscriptionRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await pool.query('SELECT * FROM subscriptions WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create subscription
subscriptionRouter.post('/', async (req, res) => {
    const { user_id, plan, start_date, status } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO subscriptions (user_id, plan, start_date, status) VALUES (?, ?, ?, ?)',
            [user_id, plan, start_date, status]
        );
        res.status(201).json({ id: result.insertId, user_id, plan, start_date, status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update subscription
subscriptionRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { plan, start_date, status } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE subscriptions SET plan = ?, start_date = ?, status = ? WHERE id = ?',
            [plan, start_date, status, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json({ message: 'Subscription updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete subscription
subscriptionRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM subscriptions WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all subscriptions for a specific user (note the updated route parameter)
subscriptionRouter.get('/user/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const [results] = await pool.query('SELECT * FROM subscriptions WHERE user_id = ?', [user_id]);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel subscription by updating its status to 'canceled'
subscriptionRouter.put('/:id/cancel', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query(
            'UPDATE subscriptions SET status = ? WHERE id = ?',
            ['canceled', id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json({ message: 'Subscription canceled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET upcoming renewals (sample query assuming a next_renewal_date field)
subscriptionRouter.get('/upcoming-renewals', async (req, res) => {
    try {
        // Example: get subscriptions that will renew within the next 7 days
        const [results] = await pool.query(
            'SELECT * FROM subscriptions WHERE next_renewal_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)'
        );
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default subscriptionRouter;

