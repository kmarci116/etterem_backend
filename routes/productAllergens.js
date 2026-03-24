const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM Product_allergens');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:product_id', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM Product_allergens WHERE product_id = ?', [req.params.product_id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    const { product_id, allergen_id } = req.body;
    try {
        const result = await db.query('INSERT INTO Product_allergens (product_id, allergen_id) VALUES (?, ?)', [product_id, allergen_id]);
        res.status(201).json({ message: 'Created successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:product_id', async (req, res) => {
    const { allergen_id } = req.body;
    try {
        const result = await db.query('UPDATE Product_allergens SET allergen_id = ? WHERE product_id = ?', [allergen_id, req.params.product_id]);
        res.json({ message: 'Updated successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:product_id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Product_allergens WHERE product_id = ?', [req.params.product_id]);
        res.json({ message: 'Deleted successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
