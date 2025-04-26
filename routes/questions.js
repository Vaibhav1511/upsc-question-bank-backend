const express = require('express');
const router = express.Router();
const db = require('../db');
const pdf = require('html-pdf');

// POST / — Add a new question
router.post('/', (req, res) => {
  const {
    question_text, option_a, option_b, option_c, option_d, correct_option,
    explanation, tags, difficulty, image_url, subject, topic,
    subtopic, question_type, format, source
  } = req.body;

  const sql = `
    INSERT INTO questions 
    (question_text, option_a, option_b, option_c, option_d, correct_option, explanation, tags, difficulty, image_url, subject, topic, subtopic, question_type, format, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    question_text, option_a, option_b, option_c, option_d, correct_option,
    explanation, tags, difficulty, image_url, subject, topic,
    subtopic, question_type, format, source
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error inserting question:", err);
      return res.status(500).send("Failed to add question.");
    }
    res.status(201).send({ message: "✅ Question added", id: result.insertId });
  });
});

// GET / — Fetch all questions with filters (⚡ now without pagination)
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

  sql += ' ORDER BY created_at DESC'; // (no limit, no offset anymore)

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("❌ Failed to fetch questions:", err);
      return res.status(500).send("Error fetching questions.");
    }

    res.json(results);
  });
});

// (PUT, DELETE, and POST /export remain same — they were already correct)

module.exports = router;