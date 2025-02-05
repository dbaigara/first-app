import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Загрузка задач при монтировании компонента
  useEffect(() => {
    fetch('/tasks')
      .then(response => response.json())
      .then(data => setTasks(data));
  }, []);

  // Добавление новой задачи
  const addTask = () => {
    if (!newTask.trim()) return; // Проверка на пустую строку
    fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask })
    })
      .then(response => response.json())
      .then(data => {
        setTasks([...tasks, { id: data.id, title: newTask, completed: false }]);
        setNewTask('');
      });
  };

  // Обновление статуса задачи
  const toggleTask = (id) => {
    const task = tasks.find(task => task.id === id);
    fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    })
      .then(() => {
        setTasks(tasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ));
      });
  };

  // Удаление задачи
  const deleteTask = (id) => {
    fetch(`/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Новая задача"
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <button onClick={addTask} style={{ padding: '8px 16px' }}>Добавить</button>
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {tasks.map(task => (
          <li key={task.id} style={{ margin: '10px 0' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              style={{ marginRight: '10px' }}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              style={{ marginLeft: '10px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
