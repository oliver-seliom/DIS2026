const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from client directory
app.use(express.static(path.join(__dirname, 'client')));

// In-memory database
let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
  { id: 2, title: '1984', author: 'George Orwell', year: 1949 },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 }
];

let nextId = 4;

// GET all books
app.get('/api/books', (req, res) => {
  console.log('GET /api/books called');
  
  res.json({
    success: true,
    count: books.length,
    data: books
  });
});

// GET a single book by ID
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: `Book with id ${id} not found`
    });
  }

  res.json({
    success: true,
    data: book
  });
});

// POST - Create a new book
app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;

  // Validation
  if (!title || !author || !year) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, author, and year'
    });
  }

  const newBook = {
    id: nextId++,
    title,
    author,
    year: parseInt(year)
  };

  books.push(newBook);

  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: newBook
  });
});

// PUT - Update an entire book
app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author, year } = req.body;

  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Book with id ${id} not found`
    });
  }

  // Validation
  if (!title || !author || !year) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, author, and year'
    });
  }

  books[bookIndex] = {
    id,
    title,
    author,
    year: parseInt(year)
  };

  res.json({
    success: true,
    message: 'Book updated successfully',
    data: books[bookIndex]
  });
});

// PATCH - Partially update a book
app.patch('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;

  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Book with id ${id} not found`
    });
  }

  // Apply only the provided fields
  books[bookIndex] = {
    ...books[bookIndex],
    ...updates,
    id // Ensure ID cannot be changed
  };

  res.json({
    success: true,
    message: 'Book updated successfully',
    data: books[bookIndex]
  });
});

// DELETE - Remove a book
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Book with id ${id} not found`
    });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];

  res.json({
    success: true,
    message: 'Book deleted successfully',
    data: deletedBook
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the Books REST API',
    endpoints: {
      'GET /api/books': 'Get all books',
      'GET /api/books/:id': 'Get a book by ID',
      'POST /api/books': 'Create a new book',
      'PUT /api/books/:id': 'Update a book (full replacement)',
      'PATCH /api/books/:id': 'Update a book (partial)',
      'DELETE /api/books/:id': 'Delete a book'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`View the web app at http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/books`);
});
