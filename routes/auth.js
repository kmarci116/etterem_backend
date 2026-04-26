const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.post('/add-desk', async (req, res) => {
    try{
        const { name, password } = req.body;
        if (!name || !password) {
            res.status(400).send("Minden mező kitöltése kötelező");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO desks (name, password) VALUES (?, ?)', [name, hashedPassword]);
        res.status(201).send("Asztal létrehozva");
    } catch (err) {
        console.error("Hiba az asztal létrehozásakor: ", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).send("Ez a név már használatba van");
        }
        res.status(500).send("Hiba az asztal létrehozása közben");
    }
});

async function generateAdminHash(){
    const adminHash = await bcrypt.hash("admin", 10);
    console.log(adminHash);
}

generateAdminHash();

router.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try{
        const [desk] = await db.query('SELECT * FROM desks WHERE name = ?', [name]);
        console.log(desk);
        if(desk && await bcrypt.compare(password, desk.password)){
            const token = jwt.sign({ id: desk.id, name: desk.name }, process.env.JWT_SECRET, { expiresIn: '1h'});
            res.json({token});
        } else{
            res.status(401).send("Hibás név vagy jelszó");
        }
    } catch (err) {
        console.error("Bejelentkezési hiba: ", err);
        res.status(500).send("Hiba a bejelentkezés közben");
    }
})

router.post('/current-desk', verifyToken, async (req, res) => {
    try{
        const [desk] = await db.query('SELECT id, name FROM desks WHERE id = ?', [req.user.id]);
        res.json(desk);
    } catch (err) {
        console.error("Hiba a jelenlegi asztal lekérdezésekor: ", err);
        res.status(500).send("Hiba a jelenlegi asztal lekérdezésekor");
    }
})

module.exports = router;