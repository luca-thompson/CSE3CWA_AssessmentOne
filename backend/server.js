const express = require('express');

const quotesRouter = require('./routes/quotes.js');

const app = express();

app.use(express.json());
app.use('/api/quotes', quotesRouter);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));