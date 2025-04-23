// db.js
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',        // where MySQL is hosted
  user: 'root',             // your MySQL username
  password: 'vaibhav@5096', // your MySQL password
  database: 'upsc_question_bank'  // name of your database
});

// Connect and handle errors
connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL as ID', connection.threadId);
});

// Export the connection so we can use it in other files
module.exports = connection;