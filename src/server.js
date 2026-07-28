require('dotenv').config();

const app = require('./app');
const { initializeDatabase } = require('../src/db');

async function startServer() {
  const port = Number(process.env.PORT) || 4000;

  await initializeDatabase({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'invoiceApplication',
  });

  app.listen(port, () => {
    console.log(`Invoice Application backend listening on port ${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });
}

module.exports = { startServer };