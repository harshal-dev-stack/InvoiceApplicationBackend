const db = require('../db');

async function getInvoiceDataById(req, res, next) {
  try {
    const invoiceId = Number(req.params.invoiceId);

    if (!Number.isInteger(invoiceId) || invoiceId <= 0) {
      return res.status(400).json({ message: 'Invalid invoice id' });
    }

    const [rows] = await db.query(
      `
      SELECT
        inv.invoiceID,
        inv.customerName,
        inv_itm.itemID,
        inv_itm.name AS item_name,
        inv_itm.price
      FROM invoices inv
      LEFT JOIN invoiceItems inv_itm ON inv_itm.invoiceID = inv.invoiceID
      WHERE inv.invoiceID = ?
      ORDER BY inv_itm.itemID ASC
    `,
      [invoiceId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const firstRow = rows[0];
    const items = rows
      .filter((row) => row.item_id != null)
      .map((row) => ({
        itemId: Number(row.item_id),
        name: row.item_name,
        price: Number(row.price),
      }));

    return res.status(200).json({
      invoiceId: Number(firstRow.invoice_id),
      customerName: firstRow.customer_name,
      items,
    });
  } catch (error) {
    console.error('Error occurred while fetching the data', error)
    return next(error);
  }
}

module.exports = {
  getInvoiceDataById
};