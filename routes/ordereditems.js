const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM Ordered_items');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM Ordered_items WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    const { id, special_request, order_id, serving_status, quantity, current_price, course_number, product_id } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Ordered_items (id, special_request, order_id, serving_status, quantity, current_price, course_number, product_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, special_request, order_id, serving_status, quantity, current_price, course_number, product_id]
        );
        res.status(201).json({ message: 'Created successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
    const { special_request, order_id, serving_status, quantity, current_price, course_number, product_id } = req.body;
    try {
        const result = await db.query(
            'UPDATE Ordered_items SET special_request = ?, order_id = ?, serving_status = ?, quantity = ?, current_price = ?, course_number = ?, product_id = ? WHERE id = ?',
            [special_request, order_id, serving_status, quantity, current_price, course_number, product_id, req.params.id]
        );
        res.json({ message: 'Updated successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Ordered_items WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
