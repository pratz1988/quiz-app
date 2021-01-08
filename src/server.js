const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const _ = require('lodash');
const cors = require("cors");
const quizzes = require('../data/quizzes.json');

// CORS
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
};

/** Helper which grades a quiz based on answers provided */
const gradeQuiz = (quiz, answers) => {
  const result = {
    correct: 0,
    incorrect: 0,
    questions: {},
  };

  for (let i = 0; i < quiz.questions.length; i++) {
    const question = quiz.questions[i];
    const answer = answers[question.id];
    if (answer && answer == question.answer) {
      result.correct += 1;
      result.questions[question.id] = true;
    } else {
      result.incorrect += 1;  
      result.questions[question.id] = false;
    }
  }

  return result;
};

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors(corsOptions));

/**
 * Returns a list of quizzes with titles and IDs
 */
app.get('/api/quizzes', (req, res) => {
  const quizList = Object.keys(quizzes)
    .map((key) => _.pick(quizzes[key], ['id', 'title']))
  return res.json(quizList);
});

/** 
 * Returns quiz data for the given ID, omitting the answers
 */
app.get('/api/quizzes/:id', (req, res) => {
  const quiz = quizzes[req.params.id];
  if (!quiz) {
    return res.sendStatus(404);
  }

  const questions = quiz.questions.map((q) => _.omit(q, 'answer'));
  const result = {...quiz, questions};

  res.json(result);
});

/**
 * Handles a quiz submission and returns a graded result
 */
app.post('/api/quizzes/:id/attempt', (req, res) => {
  const quiz = quizzes[req.params.id];
  const answers = req.body.answers;

  if (!quiz) {
    return res.sendStatus(404);
  }

  if (!answers) {
    return res.sendStatus(400);
  }

  const result = gradeQuiz(quiz, answers);
  return res.json(result);
});

app.listen(process.env.PORT || 8080);