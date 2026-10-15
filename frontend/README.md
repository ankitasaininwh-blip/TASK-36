# Task 36 – Authentication with JWT

## Project Overview

This project implements a user authentication system using React.js for the frontend and Node.js with Express.js for the backend. It uses JSON Web Tokens (JWT) to authenticate users and protect restricted routes.

## Features

- User registration with username and password
- User login and credential verification
- Secure password hashing using bcryptjs
- JWT token generation after successful login
- Authentication middleware for protected routes
- Protected dashboard with user information
- JWT token storage using browser localStorage
- Logout functionality
- Responsive user interface

## Technologies Used

### Frontend
- React.js
- Vite
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- CORS

## Project Structure

```text
ankita_task-36/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js
- npm
- Visual Studio Code or another code editor

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd ankita_task-36
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
JWT_SECRET=your_long_random_secret
```

Start the backend server:

```bash
npm run dev
```

The backend will run at:

`http://localhost:5000`

### 3. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm install axios
npm run dev
```

Open the local URL displayed by Vite in your browser, usually:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check backend status |
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate a user and generate a JWT |
| GET | `/protected` | Access protected user data |

## Authentication Workflow

1. The user registers with a username and password.
2. The backend hashes the password using bcryptjs.
3. The user logs in using the registered credentials.
4. The backend verifies the password and generates a JWT.
5. The frontend stores the token in localStorage.
6. The frontend sends the token in the Authorization header when accessing protected routes.
7. The backend verifies the token before returning protected data.
8. The user can log out to remove the locally stored token.

## Testing

- Register a new account.
- Log in using the registered credentials.
- Access the protected route.
- Verify that protected user information is displayed.
- Log out and verify that the session ends.
- Test invalid credentials and access without a valid token.

## Data Storage

This assignment uses an in-memory array to store registered users. The data is temporary and is cleared when the backend server restarts. A persistent database can be integrated for production use.

## Security Notes

- Passwords are hashed before storage.
- JWT tokens have a limited validity period.
- The JWT secret must remain private.
- Never upload the `.env` file or real secrets to GitHub.
- For production applications, use HTTPS and consider secure, HttpOnly cookies for token storage.


## License

This project was developed for educational and assignment purposes.
