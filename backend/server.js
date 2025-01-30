const express = require('express');
const app = express();
const db = require('./db');
const port = 3001;

app.use(express.json());

// Все маршруты начинаются с /api
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  db.run('INSERT INTO tasks (title, completed) VALUES (?, ?)', [title, false], function(err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ id: this.lastID });
    }
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.run('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], function(err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ success: true });
    }
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ success: true });
    }
  });
});

app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
