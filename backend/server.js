const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const tasksFile = path.join(__dirname, 'tasks.txt');

// Create tasks.txt if it doesn't exist
if (!fs.existsSync(tasksFile)) {
    fs.writeFileSync(tasksFile, '');
}

// Get all tasks
app.get('/tasks', (req, res) => {
    try {
        const tasks = fs.readFileSync(tasksFile, 'utf8')
            .split('\n')
            .filter(task => task.trim() !== '')
            .map(task => ({ text: task }));
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error reading tasks' });
    }
});

// Add new task
app.post('/tasks', (req, res) => {
    try {
        const { task } = req.body;
        fs.appendFileSync(tasksFile, task + '\n');
        res.json({ message: 'Task added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding task' });
    }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});