const express = require('express');

const quotesRouter = require('./routes/quotes');

const app = express();

app.use(express.json());
app.use('/quotes', quotesRouter);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));