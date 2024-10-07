const mysql = require("mysql2");

// Set up MySQL connection

const db = mysql.createConnection({
    host: "localhost", // replace with your MySQL host
    user: "root", // replace with your MySQL user
    password: "rrrrrrrrrrr", // replace with your MySQL password
    database: "lasop", // replace with your MySQL database name
  });
  
  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      return;
    }
    console.log("Connected to MySQL database");
  });


  module.exports = db