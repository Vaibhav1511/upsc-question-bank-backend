// routes/questions.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const {
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    explanation,
    tags,
    difficulty,
    image_url,
    subject,
    topic,
    subtopic,
    question_type,
    format
  } = req.body;

  const sql = `
    INSERT INTO questions 
    (question_text, option_a, option_b, option_c, option_d, correct_option, explanation, tags, difficulty, image_url, subject, topic, subtopic, question_type, format)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    explanation,
    tags,
    difficulty,
    image_url,
    subject,
    topic,
    subtopic,
    question_type,
    format
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error inserting question:", err);
      return res.status(500).send("Failed to add question.");
    }
    res.status(201).send({ message: "✅ Question added", id: result.insertId });
  });
});



module.exports = router;

// GET /questions — fetch all questions
router.get('/', (req, res) => {
  let sql = 'SELECT * FROM questions WHERE 1=1';
  const values = [];

  if (req.query.tag) {
    sql += ' AND tags LIKE ?';
    values.push(`%${req.query.tag}%`);
  }

  if (req.query.difficulty) {
    sql += ' AND difficulty = ?';
    values.push(req.query.difficulty);
  }

  if (req.query.keyword) {
    sql += ' AND question_text LIKE ?';
    values.push(`%${req.query.keyword}%`);
  }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("❌ Failed to filter questions:", err);
      return res.status(500).send("Error fetching questions.");
    }

    res.json(results);
  });
});


// PUT /questions/:id — update a question
router.put('/:id', (req, res) => {
  const {
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    explanation,
    tags,
    difficulty,
    image_url,
    subject,
    topic,
    subtopic,
    question_type,
    format
  } = req.body;

  const questionId = req.params.id;

  const sql = `
    UPDATE questions SET 
      question_text = ?, 
      option_a = ?, 
      option_b = ?, 
      option_c = ?, 
      option_d = ?, 
      correct_option = ?, 
      explanation = ?, 
      tags = ?, 
      difficulty = ?, 
      image_url = ?, 
      subject = ?, 
      topic = ?, 
      subtopic = ?, 
      question_type = ?, 
      format = ?
    WHERE id = ?
  `;

  const values = [
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    explanation,
    tags,
    difficulty,
    image_url,
    subject,
    topic,
    subtopic,
    question_type,
    format,
    questionId
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error updating question:", err);
      return res.status(500).send("Failed to update question.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Question not found.");
    }

    res.send({ message: "✅ Question updated successfully" });
  });
});


// DELETE /questions/:id — delete a question
router.delete('/:id', (req, res) => {
  const questionId = req.params.id;

  const sql = 'DELETE FROM questions WHERE id = ?';

  db.query(sql, [questionId], (err, result) => {
    if (err) {
      console.error("❌ Delete failed:", err);
      return res.status(500).send("Error deleting question.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Question not found.");
    }

    res.send({ message: "🗑️ Question deleted successfully." });
  });
});

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// POST /export — generate PDF from selected questions
router.post('/export', async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).send("Please provide an array of IDs.");
  }

  const sql = `SELECT * FROM questions WHERE id IN (?)`;

  db.query(sql, [ids], async (err, results) => {
    if (err) {
      console.error("❌ Failed to fetch questions for export:", err);
      return res.status(500).send("Export failed.");
    }

    const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          .question { margin-bottom: 30px; }
          .options { margin-left: 20px; }
        </style>
      </head>
      <body>
        ${results.map((q, i) => `
          <div class="question">
            <strong>Q${i + 1}:</strong> ${q.question_text}
            <div class="options">
              <p>A. ${q.option_a}</p>
              <p>B. ${q.option_b}</p>
              <p>C. ${q.option_c}</p>
              <p>D. ${q.option_d}</p>
              <p><strong>Answer:</strong> ${q.correct_option}</p>
              <p><em>Explanation:</em> ${q.explanation}</p>
            </div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Set response headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=question-bank.pdf');
    res.send(pdfBuffer);
  });
});

