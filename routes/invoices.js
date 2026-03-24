const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM Invoices');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM Invoices WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    const { total_paid, base_amount, tip, total_amount, billing_details, order_id, payment_method } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Invoices (total_paid, base_amount, tip, total_amount, billing_details, order_id, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [total_paid, base_amount, tip, total_amount, billing_details, order_id, payment_method]
        );
        res.status(201).json({ message: 'Created successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
    const { total_paid, base_amount, tip, total_amount, billing_details, order_id, payment_method } = req.body;
    try {
        const result = await db.query(
            'UPDATE Invoices SET total_paid = ?, base_amount = ?, tip = ?, total_amount = ?, billing_details = ?, order_id = ?, payment_method = ? WHERE id = ?',
            [total_paid, base_amount, tip, total_amount, billing_details, order_id, payment_method, req.params.id]
        );
        res.json({ message: 'Updated successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Invoices WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
