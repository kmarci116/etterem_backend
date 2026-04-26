const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM Ordered_items');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/order/:orderId', async (req, res) => {
    try {
        const rows = await db.query(`
            SELECT Ordered_items.*, Products.name as product_name, Products.price as default_price
            FROM Ordered_items
            LEFT JOIN Products ON Ordered_items.product_id = Products.id
            WHERE Ordered_items.order_id = ?
        `, [req.params.orderId]);
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
    const { special_request, order_id, serving_status, quantity, current_price, course_number, product_id } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Ordered_items (special_request, order_id, serving_status, quantity, current_price, course_number, product_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [special_request || null, order_id, serving_status, quantity, current_price, course_number || null, product_id]
        );
        res.status(201).json({ message: 'Created successfully', itemId: Number(result.insertId), result });
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
