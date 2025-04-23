// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const questionsRoutes = require('./routes/questions');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/questions', questionsRoutes);

app.get('/', (req, res) => {
  res.send('✅ UPSC Question Bank API is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});