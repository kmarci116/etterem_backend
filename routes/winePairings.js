const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM Wine_pairings');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:wine_id/:product_id', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM Wine_pairings WHERE wine_id = ? AND product_id = ?', [req.params.wine_id, req.params.product_id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    const { wine_id, product_id, pairing_reason } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Wine_pairings (wine_id, product_id, pairing_reason) VALUES (?, ?, ?)',
            [wine_id, product_id, pairing_reason]
        );
        res.status(201).json({ message: 'Created successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:wine_id/:product_id', async (req, res) => {
    const { pairing_reason } = req.body;
    try {
        const result = await db.query(
            'UPDATE Wine_pairings SET pairing_reason = ? WHERE wine_id = ? AND product_id = ?',
            [pairing_reason, req.params.wine_id, req.params.product_id]
        );
        res.json({ message: 'Updated successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:wine_id/:product_id', async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM Wine_pairings WHERE wine_id = ? AND product_id = ?',
            [req.params.wine_id, req.params.product_id]
        );
        res.json({ message: 'Deleted successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
