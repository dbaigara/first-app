const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// Создаем Express-приложение
const app = express();
const port = process.env.PORT || 3001; // Используем порт из переменной окружения или 3001 для локальной разработки

// Подключаем middleware для обработки JSON и CORS
app.use(cors());
app.use(express.json());

// Подключаемся к базе данных SQLite (в памяти для простоты)
const db = new sqlite3.Database(':memory:'); // Используем базу данных в памяти

// Создаем таблицу tasks при запуске сервера
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE
    )
  `);
});

// Маршрут для получения всех задач
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Маршрут для создания новой задачи
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.run(
    'INSERT INTO tasks (title, completed) VALUES (?, ?)',
    [title, false],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, title, completed: false });
      }
    }
  );
});

// Маршрут для обновления задачи (например, отметка как выполненной)
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  db.run(
    'UPDATE tasks SET completed = ? WHERE id = ?',
    [completed, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Task not found' });
      } else {
        res.json({ id, completed });
      }
    }
  );
});

// Маршрут для удаления задачи
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.json({ success: true });
    }
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
