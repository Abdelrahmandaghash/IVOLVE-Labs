const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const initializeDatabase = require("./db");

const app = express();
const PORT = 3000;
const logDir = "/app/logs";
fs.mkdirSync(logDir, { recursive: true });
const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

let db;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).send("iVolve web app is working and connected to MySQL.");
  } catch (error) {
    res.status(503).send("MySQL is not ready.");
  }
});

app.get("/ready", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).send("Ready");
  } catch (error) {
    res.status(503).send("Not ready");
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, price, image FROM products ORDER BY id");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Could not read products" });
  }
});

async function start() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      db = await initializeDatabase();
      console.log(`Connected to MySQL database '${process.env.DB_NAME || "ivolve"}'.`);
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server listening on port ${PORT}`);
      });
      return;
    } catch (error) {
      console.error(`MySQL connection attempt ${attempt}/30 failed: ${error.message}`);
      if (attempt === 30) throw error;
      await wait(2000);
    }
  }
}

start().catch((error) => {
  console.error("Application could not connect to MySQL:", error);
  process.exit(1);
});
