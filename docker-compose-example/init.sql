-- Initialize the tasks database
-- This script runs automatically when the PostgreSQL container starts for the first time

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample tasks for demonstration
INSERT INTO tasks (title, description, completed) VALUES
    ('Learn Docker basics', 'Understand containers, images, and Dockerfiles', true),
    ('Study docker-compose', 'Learn about services, networks, and volumes', false),
    ('Build a sample project', 'Create a multi-service application with docker-compose', false),
    ('Explore networking', 'Test service-to-service communication', false);

-- Grant permissions (just in case)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO taskuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO taskuser;
