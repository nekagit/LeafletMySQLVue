const express = require("express");
const mysql = require("mysql2");
const cors = require("cors"); // Add this line to import cors module
const populateDatabase = require("./populatedDB.js");

const hostname = "127.0.0.1";
const port = 3000;

const app = express();

// CORS setup
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this origin
  methods: ["GET"], // Allow only GET requests
};

app.use(cors(corsOptions));

const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "root",
  database: "KEP_1M",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);

  // Populate the database
  populateDatabase((err) => {
    if (err) {
      console.error("Error populating the database: ", err.stack);
      return;
    }
    console.log("Database populated successfully");
  });
});

const query = `
    SELECT 
        plz.Name AS Region, 
        PLZ_From AS Postleitzahl, 
        plz.Residents AS Einwohner, 
        AVG(Weight) AS Durchschnittsgewicht,
        plz.Latitude,  
        plz.Longitude  
    FROM shipments
    INNER JOIN plz ON PLZ_From=plz.PLZ
    WHERE Weight > 0 AND Weight <= 31.5
    GROUP BY PLZ_From
    ORDER BY AVG(Weight) DESC
`;

app.get("/data", (req, res) => {
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error querying the database" });
      return;
    }
    res.status(200).json(results);
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
