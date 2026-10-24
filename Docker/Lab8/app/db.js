const mysql = require("mysql2/promise");

async function initializeDatabase() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "ivolve",
  });

  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      image TEXT
    )
  `);

  const [rows] = await db.query("SELECT COUNT(*) AS count FROM products");
  if (Number(rows[0].count) === 0) {
    await db.query(
      `INSERT INTO products (name, price, image) VALUES
       (?, ?, ?), (?, ?, ?), (?, ?, ?)`,
      [
        "Red Shirt", 29.99, "https://via.placeholder.com/200x150/ff4444/fff?text=Red+Shirt",
        "Blue Jeans", 49.99, "https://via.placeholder.com/200x150/4444ff/fff?text=Blue+Jeans",
        "Green Hat", 19.99, "https://via.placeholder.com/200x150/44ff44/fff?text=Green+Hat",
      ]
    );
  }

  return db;
}

module.exports = initializeDatabase;
