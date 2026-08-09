const express = require('express');
const router = express.Router();

const db = require("../db.js");


// 1. GET all quotes
// URL: GET /quotes
router.get('/', (req, res) => {
    res.send(db);
});

// 2. GET a single quote by ID
// URL: GET /quotes/1
router.get('/:id', (req, res) => {
    const quote = quotes.find(q => q.id === parseInt(req.params.id));
    if (!quote) {
        return res.status(404).send('Quote not found');
    }
    res.send(quote);
});

module.exports = router;
