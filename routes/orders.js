const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const { table_number } = req.query;
        let query = `
            SELECT Orders.*, desks.name AS table_name,
                   Invoices.payment_method, Invoices.tip, Invoices.billing_details, Invoices.total_amount
            FROM Orders 
            LEFT JOIN desks ON Orders.table_number = desks.id
            LEFT JOIN Invoices ON Orders.invoice_id = Invoices.id
        `;
        const params = [];
        if (table_number) {
            query += ' WHERE Orders.table_number = ?';
            params.push(table_number);
        }
        const rows = await db.query(query, params);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM Orders WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    const { status, table_number, invoice_id } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Orders (status, table_number, invoice_id) VALUES (?, ?, ?)',
            [status, table_number, invoice_id || null]
        );
        res.status(201).json({ message: 'Created successfully', orderId: Number(result.insertId), result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
    const { status, table_number, invoice_id } = req.body;
    try {
        const orderRes = await db.query('SELECT * FROM Orders WHERE id = ?', [req.params.id]);
        if (orderRes.length === 0) return res.status(404).json({error: 'Not found'});
        const order = orderRes[0];
        
        const newStatus = status !== undefined ? status : order.status;
        const newTable = table_number !== undefined ? table_number : order.table_number;
        const newInvoice = invoice_id !== undefined ? invoice_id : order.invoice_id;

        const result = await db.query(
            'UPDATE Orders SET status = ?, table_number = ?, invoice_id = ? WHERE id = ?',
            [newStatus, newTable, newInvoice, req.params.id]
        );
        res.json({ message: 'Updated successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Orders WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted successfully', result });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
