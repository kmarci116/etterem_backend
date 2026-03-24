const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM Products');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM Products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    const { id, is_available, story_text, chef_note, tax_rate, category_id, name, description, price } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Products (id, is_available, story_text, chef_note, tax_rate, category_id, name, description, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, is_available, story_text, chef_note, tax_rate, category_id, name, description, price]
        );
        res.status(201).json({ message: 'Created successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
    const { is_available, story_text, chef_note, tax_rate, category_id, name, description, price } = req.body;
    try {
        const result = await db.query(
            'UPDATE Products SET is_available = ?, story_text = ?, chef_note = ?, tax_rate = ?, category_id = ?, name = ?, description = ?, price = ? WHERE id = ?',
            [is_available, story_text, chef_note, tax_rate, category_id, name, description, price, req.params.id]
        );
        res.json({ message: 'Updated successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
