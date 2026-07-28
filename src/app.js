const express = require('express');
const cors = require('cors');
const app = express();
const invoiceRoutes = require('../src/routes/invoiceRoutes');
// const errorHandler = require('../src/middleware/errorHandler');
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || true,
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/invoices', invoiceRoutes);
// app.use(errorHandler);
module.exports = app;