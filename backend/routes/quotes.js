const express = require('express');
const router = express.Router();

const db = require("../db.js");


// 1. GET all quotes
// URL: GET /quotes
router.get('/', (req, res) => {
    const sqlStatement = "SELECT * FROM quotes;"

    res.send(db.prepare('SELECT * FROM quotes').all());
});

// 2. GET a single quote by ID
// URL: GET /quotes/1
router.get('/:id', (req, res) => {
    const quote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);
    if (!quote) {
        return res.status(404).send('Quote not found\n');
    }
    res.send(quote);
});

module.exports = router;
