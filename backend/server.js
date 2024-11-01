// server.js
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000

// Middleware to parse JSON requests
app.use(express.json());

// Sample API route
app.get("/api", (req, res) => {
    res.json({ "users": ["Kai Crabb", "Elijah Carney", "Christopher Carter"] });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});