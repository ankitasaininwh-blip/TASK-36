
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from .env");
}

app.use(cors());
app.use(express.json());

// In-memory storage for this assignment
const users = [];

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Token required."
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token."
      });
    }

    req.user = user;
    next();
  });
}

// Register
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      password.length < 6
    ) {
      return res.status(400).json({
        message: "Enter a username and a password of at least 6 characters."
      });
    }

    const normalizedUsername = username.trim();

    const existingUser = users.find(
      (user) =>
        user.username.toLowerCase() ===
        normalizedUsername.toLowerCase()
    );

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      id: users.length + 1,
      username: normalizedUsername,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Registration successful. Please log in."
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during registration."
    });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Username and password are required."
      });
    }

    const user = users.find(
      (item) =>
        item.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password."
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password."
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful.",
      token,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during login."
    });
  }
});

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: "You have accessed the protected route successfully.",
    user: req.user
  });
});

// Health check
app.get("/", (req, res) => {
  res.json({ message: "JWT Authentication API is running." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
