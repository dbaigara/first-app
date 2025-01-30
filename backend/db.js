const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Используем базу данных в памяти для простоты

db.serialize(() => {
  db.run('CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT, completed BOOLEAN)');
});

module.exports = db;
