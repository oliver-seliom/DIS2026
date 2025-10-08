# Sample REST API

A simple Express.js REST API showcasing RESTful principles with CRUD operations.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Get All Books
```
GET /api/books
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "year": 1925
    }
  ]
}
```

### Get Book by ID
```
GET /api/books/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "year": 1925
  }
}
```

### Create a New Book
```
POST /api/books
```

**Request Body:**
```json
{
  "title": "The Catcher in the Rye",
  "author": "J.D. Salinger",
  "year": 1951
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "id": 4,
    "title": "The Catcher in the Rye",
    "author": "J.D. Salinger",
    "year": 1951
  }
}
```

### Update a Book (Full Replacement)
```
PUT /api/books/:id
```

**Request Body:**
```json
{
  "title": "1984 (Updated Edition)",
  "author": "George Orwell",
  "year": 1949
}
```

### Update a Book (Partial)
```
PATCH /api/books/:id
```

**Request Body:**
```json
{
  "year": 1950
}
```

### Delete a Book
```
DELETE /api/books/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "year": 1925
  }
}
```

## Testing with cURL

```bash
# Get all books
curl http://localhost:3000/api/books

# Get a specific book
curl http://localhost:3000/api/books/1

# Create a new book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Brave New World","author":"Aldous Huxley","year":1932}'

# Update a book
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"The Great Gatsby (Updated)","author":"F. Scott Fitzgerald","year":1925}'

# Partially update a book
curl -X PATCH http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"year":1926}'

# Delete a book
curl -X DELETE http://localhost:3000/api/books/1
```

## Key REST Principles Demonstrated

- **Resource-based URLs**: `/api/books` represents the books collection
- **HTTP Methods**: GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE (remove)
- **Status Codes**: 200 (success), 201 (created), 404 (not found), 400 (bad request)
- **JSON Format**: All requests and responses use JSON
- **Stateless**: Each request contains all necessary information
- **In-memory Storage**: Simple array acts as the database
