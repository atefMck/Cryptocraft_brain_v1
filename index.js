  
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


// Setting Environment
require('dotenv').config();
const {
  PORT = 8080,
} = process.env

// Configuring main app
const app = express();

// Applying middlewares
var corsOptions = {
  origin: ["http://localhost:3000", "http://55.55.55.5:3000"]
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Launching app
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});