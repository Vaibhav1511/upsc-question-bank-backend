const express = require('express');
const router = express.Router();
const db = require('../db');
const pdf = require('html-pdf');

// POST / — Add a new question
router.post('/', (req, res) => {
  const {
    question_text, option_a, option_b, option_c, option_d, correct_option,
    explanation, tags, difficulty, image_url, subject, topic,
    subtopic, question_type, format
  } = req.body;

  const sql = `
    INSERT INTO questions 
    (question_text, option_a, option_b, option_c, option_d, correct_option, explanation, tags, difficulty, image_url, subject, topic, subtopic, question_type, format)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    question_text, option_a, option_b, option_c, option_d, correct_option,
    explanation, tags, difficulty, image_url, subject, topic,
    subtopic, question_type, format
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error inserting question:", err);
      return res.status(500).send("Failed to add question.");
    }
    res.status(201).send({ message: "✅ Question added", id: result.insertId });
  });
});

// GET / — Fetch all questions with filters
// GET / — Fetch all questions with filters
router.get('/', (req, res) => {
let sql = 'SELECT * FROM questions WHERE 1=1';
  const values = [];

  if (req.query.subject) {
    sql += ' AND subject = ?';
    values.push(req.query.subject);
  }
  if (req.query.topic) {
    sql += ' AND topic = ?';
    values.push(req.query.topic);
  }
  if (req.query.subtopic) {
    sql += ' AND subtopic = ?';
    values.push(req.query.subtopic);
  }
  if (req.query.source) {
    sql += ' AND source = ?';
    values.push(req.query.source);
  }
  if (req.query.question_type) {
    sql += ' AND question_type = ?';
    values.push(req.query.question_type);
  }
  if (req.query.format) {
    sql += ' AND format = ?';
    values.push(req.query.format);
  }

  sql += ' ORDER BY created_at DESC';

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  sql += ` LIMIT ${limit} OFFSET ${offset}`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("❌ Failed to filter questions:", err);
      return res.status(500).send("Error fetching questions.");
    }

    res.json(results);
  });
});

// PUT /:id — Update a question
router.put('/:id', (req, res) => {
  const {
    question_text, option_a, option_b, option_c, option_d, correct_option,
    explanation, tags, difficulty, image_url, subject, topic,
    subtopic, question_type, format, source
  } = req.body;

  const questionId = req.params.id;

  const sql = `
    UPDATE questions SET 
      question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ?, 
      explanation = ?, tags = ?, difficulty = ?, image_url = ?, subject = ?, topic = ?, 
      subtopic = ?, question_type = ?, format = ?, source = ?
    WHERE id = ?
  `;

  const values = [
    question_text, option_a, option_b, option_c, option_d, correct_option,
    explanation, tags, difficulty, image_url, subject, topic,
    subtopic, question_type, format, source, questionId
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

// DELETE /:id — Delete a question
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

// POST /export — Export selected questions as PDF using html-pdf
router.post('/export', (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).send("Please provide an array of IDs.");
  }

  const sql = `SELECT * FROM questions WHERE id IN (?)`;

  db.query(sql, [ids], (err, results) => {
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

    const options = { format: 'A4' };

    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
      if (err) {
        console.error("❌ PDF generation failed:", err);
        return res.status(500).send("PDF generation failed.");
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=question-bank.pdf');
      res.send(buffer);
    });
  });
});

module.exports = router;
