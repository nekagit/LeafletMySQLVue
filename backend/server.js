const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const populateDatabase = require("./populatedDB.js"); // Adjust the path as necessary

const weightController = require("./api/leafletController.js");

const hostname = "127.0.0.1";
const port = 3000;

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// CORS setup
const corsOptions = {
  origin: "http://localhost:5173", 
  methods: ["GET"], 
};

app.use(cors(corsOptions));
app.get("/averageWeight", weightController.averageWeight);
app.get("/sendingWeight", weightController.sendingWeight);
app.get("/weight", weightController.weight);
app.get("/distanceWeight", weightController.distanceWeight);
app.get("/shipments", weightController.shipments);

populateDatabase((err) => {
  if (err) {
    console.error("Failed to populate database:", err.message);
  } else {
    console.log("Database populated successfully");
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
