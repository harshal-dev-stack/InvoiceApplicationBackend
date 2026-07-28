const defaultMysql = require('mysql2/promise');

let pool = null;


async function initializeDatabase(config) {
  const mysql = defaultMysql;
  const { host, port, user, password, database } = config;
  let mysqlConntection;
  try {
    mysqlConntection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: false,
    });

    await mysqlConntection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
  } catch (error) {
    if (mysqlConntection) {
      await mysqlConntection.end().catch(() => {});
    }
    throw new Error(
      `Failed to initialize MySQL database "${database}": ${error.message}`
    );
  }

  await mysqlConntection.end();

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        invoiceID INT NOT NULL PRIMARY KEY,
        customerName VARCHAR(100) NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoiceItems (
        itemID INT NOT NULL PRIMARY KEY,
        invoiceID INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        CONSTRAINT fk_invoice_items_invoice
          FOREIGN KEY (invoiceID) REFERENCES invoices (invoiceID)
          ON DELETE CASCADE
      )
    `);

    await pool.query(
      `
      INSERT INTO invoices (invoiceID, customerName)
      VALUES (?, ?)
    `,
      [1, 'John Doe']
    );

    await pool.query(
      `
      INSERT INTO InvoiceItems (itemID, invoiceID, name, price)
      VALUES (?, ?, ?, ?)
    `,
      [1, 1, 'Widegt A', 19.99]
    );
  } catch (error) {
    await pool.end().catch(() => {});
    pool = null;
    throw new Error(
      `Failed to initialize MySQL schema or sample data: ${error.message}`
    );
  }

  return pool;
}

async function query(sql, params) {
  if (!pool) {
    throw new Error('Database has not been initialized');
  }

  return pool.query(sql, params);
}

module.exports = {
  initializeDatabase,
  query
};