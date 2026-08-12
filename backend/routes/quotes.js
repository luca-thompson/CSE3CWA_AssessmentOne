//packages
const express = require('express');
const router = express.Router();

//custom/my packages
const { calculateQuote } = require('../logic/calculateQuote');
const { validateQuoteInput } = require('../logic/validateQuoteInput');
const db = require("../db.js");


//get all
router.get('/', (req, res) => {

    const quotes = db.prepare("SELECT * FROM quotes;").all()

    if (!quotes){
      return res.status(404).send('couldnt fetch quotes\n');
    }

    res.status(200).send(quotes);

});

//get single quote by id
router.get('/:id', (req, res) => {
    const quote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);
    if (!quote) {
        return res.status(404).send('quote not found\n');
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

  const validation = validateQuoteInput(req.body);
  if (!validation.isValid) {
      return res.status(validation.httpCode).send(validation.message);
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

//put/update
router.put('/:id', (req, res) => {

  const existing = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);

  if (!existing) {
    return res.status(404).send('quote not found, cant edit\n');
  }

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

  const validation = validateQuoteInput(req.body);

  if (!validation.isValid) {
    console.log(validation)
    return res.status(validation.httpCode).send(validation.message);
  }

  const updateStatement = db.prepare(`
    UPDATE quotes SET
      customer_name = ?, cover_type = ?,
      applicant1_age = ?, applicant1_cover_history = ?,
      applicant2_age = ?, applicant2_cover_history = ?,
      hospital_cover = ?, extras_cover = ?,
      payment_frequency = ?, annual_discount = ?, notes = ?
    WHERE id = ?
  `);

  updateStatement.run(
    customer_name, cover_type,
    applicant1_age, applicant1_cover_history,
    applicant2_age, applicant2_cover_history,
    hospital_cover, extras_cover,
    payment_frequency, annual_discount, notes,
    req.params.id
  );

  const updatedQuote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);
  res.status(200).send(updatedQuote);
});

module.exports = router;
