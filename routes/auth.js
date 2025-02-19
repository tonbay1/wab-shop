const express = require('express');
const router = express.Router();

// Mock user data
const users = [];

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // TODO: Add proper validation and password hashing
        users.push({ username, password });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // TODO: Add JWT token generation
        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
