import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://backend-app-z4cb.onrender.com/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await axios.post('https://backend-app-z4cb.onrender.com/tasks', { task: newTask });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Management App</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task"
          />
          <button type="submit">Add Task</button>
        </form>
        <div className="tasks-list">
          <h2>Tasks:</h2>
          {tasks.map((task, index) => (
            <div key={index} className="task-item">
              {task.text}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
