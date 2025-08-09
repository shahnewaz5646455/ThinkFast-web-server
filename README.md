# ThinkFast Server

This is the server-side application for the Group Study platform, providing a RESTful API for managing assignments and submissions. The server is deployed on Vercel and connects to MongoDB for data storage.

## 🚀 Live Server

[https://groupstudyserver.vercel.app/](https://groupstudyserver.vercel.app/)

## Features

- **JWT Authentication** for secure API access
- **Assignments Management**: Create, update, delete, and search assignments
- **Submissions Management**: Submit, update, and fetch assignment submissions
- **Role-based Access**: Protect sensitive routes with token verification
- **MongoDB Integration** for persistent data storage

## API Endpoints

### Authentication

- `POST /jwt`  
  Generate a JWT token for a user (requires email in request body).

### Assignments

- `GET /assignments`  
  Get all assignments.
- `GET /assignments/:id`  
  Get a specific assignment by ID.
- `GET /assignments/search?q=keyword`  
  Search assignments by keyword.
- `GET /assignments/difficulty/:level`  
  Get assignments by difficulty level.
- `POST /assignments`  
  Create a new assignment.
- `PUT /assignments/:id`  
  Update an assignment (requires authentication).
- `DELETE /assignments/:id`  
  Delete an assignment.

### Submissions

- `POST /submissions`  
  Submit a new assignment.
- `PATCH /submissions/:id`  
  Update a submission.
- `GET /submissions/pending/:email`  
  Get pending submissions for a user (requires authentication).
- `GET /submissions/by-email/:email`  
  Get all submissions by a user (requires authentication).

## Environment Variables

Create a `.env` file in the root directory with the following variables:
