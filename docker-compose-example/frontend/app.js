const express = require('express');
const axios = require('axios');
const app = express();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

app.use(express.json());
app.use(express.static('public'));

// Serve the main HTML page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager - Docker Compose Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            padding: 30px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            text-align: center;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        input[type="text"] {
            flex: 1;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        input[type="text"]:focus {
            outline: none;
            border-color: #667eea;
        }
        button {
            padding: 12px 24px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: background 0.3s;
        }
        button:hover {
            background: #5568d3;
        }
        .task-list {
            list-style: none;
        }
        .task-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f8f9fa;
            margin-bottom: 10px;
            border-radius: 5px;
            transition: all 0.3s;
        }
        .task-item:hover {
            background: #e9ecef;
            transform: translateX(5px);
        }
        .task-item.completed {
            opacity: 0.6;
        }
        .task-item.completed .task-text {
            text-decoration: line-through;
        }
        .task-checkbox {
            width: 20px;
            height: 20px;
            margin-right: 15px;
            cursor: pointer;
        }
        .task-content {
            flex: 1;
        }
        .task-text {
            font-size: 16px;
            color: #333;
            font-weight: 500;
        }
        .task-desc {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        .delete-btn {
            padding: 8px 16px;
            background: #dc3545;
            font-size: 14px;
        }
        .delete-btn:hover {
            background: #c82333;
        }
        .empty-state {
            text-align: center;
            color: #999;
            padding: 40px;
            font-style: italic;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            background: #28a745;
            color: white;
            border-radius: 3px;
            font-size: 12px;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Task Manager <span class="status-badge">Docker Compose Demo</span></h1>
        <p class="subtitle">Frontend (Node.js) → Backend (Python/Flask) → Database (PostgreSQL)</p>

        <div class="input-group">
            <input type="text" id="taskTitle" placeholder="Task title (required)" />
            <input type="text" id="taskDesc" placeholder="Description (optional)" />
            <button onclick="addTask()">Add Task</button>
        </div>

        <ul class="task-list" id="taskList">
            <li class="empty-state">Loading tasks...</li>
        </ul>
    </div>

    <script>
        const API_URL = '/api';

        async function loadTasks() {
            try {
                const response = await fetch(API_URL + '/tasks');
                const tasks = await response.json();

                const taskList = document.getElementById('taskList');

                if (tasks.length === 0) {
                    taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
                    return;
                }

                taskList.innerHTML = tasks.map(task => \`
                    <li class="task-item \${task.completed ? 'completed' : ''}">
                        <input
                            type="checkbox"
                            class="task-checkbox"
                            \${task.completed ? 'checked' : ''}
                            onchange="toggleTask(\${task.id}, this.checked)"
                        />
                        <div class="task-content">
                            <div class="task-text">\${task.title}</div>
                            \${task.description ? \`<div class="task-desc">\${task.description}</div>\` : ''}
                        </div>
                        <button class="delete-btn" onclick="deleteTask(\${task.id})">Delete</button>
                    </li>
                \`).join('');
            } catch (error) {
                console.error('Error loading tasks:', error);
                document.getElementById('taskList').innerHTML =
                    '<li class="empty-state">Error loading tasks. Check console.</li>';
            }
        }

        async function addTask() {
            const title = document.getElementById('taskTitle').value.trim();
            const description = document.getElementById('taskDesc').value.trim();

            if (!title) {
                alert('Please enter a task title');
                return;
            }

            try {
                await fetch(API_URL + '/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description })
                });

                document.getElementById('taskTitle').value = '';
                document.getElementById('taskDesc').value = '';
                loadTasks();
            } catch (error) {
                console.error('Error adding task:', error);
                alert('Error adding task');
            }
        }

        async function toggleTask(id, completed) {
            try {
                await fetch(API_URL + '/tasks/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed })
                });
                loadTasks();
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }

        async function deleteTask(id) {
            if (!confirm('Delete this task?')) return;

            try {
                await fetch(API_URL + '/tasks/' + id, { method: 'DELETE' });
                loadTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }

        // Load tasks on page load
        loadTasks();

        // Allow Enter key to add task
        document.getElementById('taskTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
        document.getElementById('taskDesc').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
    </script>
</body>
</html>
  `);
});

// Proxy API requests to backend
app.get('/api/tasks', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/tasks`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/tasks`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating task:', error.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const response = await axios.put(`${BACKEND_URL}/api/tasks/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error updating task:', error.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/api/tasks/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
  console.log(`Backend URL: ${BACKEND_URL}`);
});
