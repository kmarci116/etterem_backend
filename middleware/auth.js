const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).send("A token megadása kötelező");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send("Érvénytelen token");
    }
};

const verifyAdmin = async (req, res, next) => {
    verifyToken(req, res, async () => {
        // verifyToken already populates req.user if successful
        try {
            // Check if name is admin string
            if (req.user.name !== 'admin') {
                return res.status(403).send("Nincs jogosultságod, csak adminok számára elérhető.");
            }
            
            // Check if the password for this user is 'admin' as well according to DB
            const desks = await db.query('SELECT * FROM desks WHERE id = ?', [req.user.id]);
            
            if (!desks || desks.length === 0) {
                return res.status(403).send("A felhasználó nem található.");
            }
            
            const desk = desks[0];
            const isPasswordAdmin = await bcrypt.compare('admin', desk.password);
            
            if (!isPasswordAdmin) {
                return res.status(403).send("Nincs jogosultságod, admin jelszó szükséges.");
            }
            
            next();
        } catch (err) {
            console.error("Admin verification error:", err);
            return res.status(500).send("Hiba az admin jogosultság ellenőrzésekor.");
        }
    });
};

module.exports = {
    verifyToken,
    verifyAdmin
};
