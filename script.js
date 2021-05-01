const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const TodoModel = require('./models/todo.js');

const app = express();

mongoose.connect('mongodb://localhost/todoListDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', express.static(path.resolve(__dirname, 'assets')));

app.use(express.json());

app.post('/api/modify', async (req, res) => {
  const { old: oldTitle, new: newTitle } = req.body;

  const response = await TodoModel.updateOne(
    {
      record: oldTitle,
    },
    {
      $set: { title: newTitle },
    },
  );
  console.log(response);
  res.json({ status: 'ok' });
});

app.post('/api/get', async (req, res) => {
  const record = await TodoModel.find({ record: 'ama' });
  console.log(record);

  // Create -> insert somth in database.
  const response = await TodoModel.create(record);

  console.log(response);
  res.json({ status: 'ok' });
});

app.post('/api/create', async (req, res) => {
  const record = req.body;
  console.log(record);
});

app.listen(3000, () => {
  console.log('Server is up');
});
