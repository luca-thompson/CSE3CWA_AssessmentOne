//packages
const express = require('express');
const router = express.Router();

//custom/my packages
const { calculateQuote } = require('../logic/calculateQuote');
const db = require("../db.js");


//get all
router.get('/', (req, res) => {
    const sqlStatement = "SELECT * FROM quotes;"

    res.status(200).send(db.prepare(sqlStatement).all());

    
});

//get single quote by id
router.get('/:id', (req, res) => {
    const quote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);
    if (!quote) {
        return res.status(404).send('Quote not found\n');
    }

    const calculation = calculateQuote(quote);

    res.status(200).json({ quote, calculation });
});

//post new quote to db
router.post('/', (req, res) => {
  const {
    customer_name,
    cover_type,
    applicant1_age,
    applicant1_cover_history,
    applicant2_age,
    applicant2_cover_history,
    hospital_cover,
    extras_cover,
    payment_frequency,
    annual_discount,
    notes
  } = req.body;


  if (!customer_name || !cover_type || !hospital_cover || !extras_cover || !payment_frequency) {
    return res.status(400).send('some fields null\n');
  }

  if (applicant1_age < 18 || applicant1_age > 100) {
    return res.status(400).send('Applicant 1 age outside of range\n');
  }

  if (cover_type !== 'Single') {
    // Couple / Family require applicant 2
    if (!applicant2_age || !applicant2_cover_history) {
      return res.status(400).send('Missing applicant two age or history\n');
    }
    if (applicant2_age < 18 || applicant2_age > 100) {
      return res.status(400).send('Applicant 2 age outside of range\n');
    }
  }

  if (annual_discount < 0 || annual_discount > 0.10) {
    return res.status(400).send('Annual discount percentage must be between 0 and 10\n');
  }

  const insertStatement = db.prepare(`
    INSERT INTO quotes (
      customer_name, cover_type,
      applicant1_age, applicant1_cover_history,
      applicant2_age, applicant2_cover_history,
      hospital_cover, extras_cover,
      payment_frequency, annual_discount, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insertStatement.run(
    customer_name, cover_type,
    applicant1_age, applicant1_cover_history,
    applicant2_age, applicant2_cover_history,
    hospital_cover, extras_cover,
    payment_frequency, annual_discount, notes
  );

  const newQuote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).send(newQuote);
});

//put/update existing quote

module.exports = router;
