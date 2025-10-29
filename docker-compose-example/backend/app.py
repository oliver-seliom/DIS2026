from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import os
import time

app = Flask(__name__)
CORS(app)

# Database configuration from environment variable
DATABASE_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    """Create a database connection"""
    conn = psycopg2.connect(DATABASE_URL)
    return conn

@app.route('/health')
def health():
    """Health check endpoint"""
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify({'status': 'healthy', 'database': 'connected'}), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT id, title, description, completed, created_at FROM tasks ORDER BY created_at DESC')
        tasks = cur.fetchall()
        cur.close()
        conn.close()

        task_list = []
        for task in tasks:
            task_list.append({
                'id': task[0],
                'title': task[1],
                'description': task[2],
                'completed': task[3],
                'created_at': task[4].isoformat()
            })

        return jsonify(task_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Create a new task"""
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description', '')

        if not title:
            return jsonify({'error': 'Title is required'}), 400

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO tasks (title, description) VALUES (%s, %s) RETURNING id',
            (title, description)
        )
        task_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'id': task_id, 'message': 'Task created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task (toggle completed status)"""
    try:
        data = request.get_json()
        completed = data.get('completed')

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'UPDATE tasks SET completed = %s WHERE id = %s',
            (completed, task_id)
        )
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'message': 'Task updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM tasks WHERE id = %s', (task_id,))
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Wait a bit for database to be ready (in addition to healthcheck)
    time.sleep(2)
    app.run(host='0.0.0.0', port=4000, debug=True)
