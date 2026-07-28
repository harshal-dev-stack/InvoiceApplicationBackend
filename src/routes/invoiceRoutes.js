const express = require('express');
const invoiceController = require('../controllers/invoiceController');

const router = express.Router();

router.get('/:invoiceId', invoiceController.getInvoiceDataById);

module.exports = router;