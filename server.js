// server.js

const express = require('express');
const mongoose = require('mongoose');
const userService = require('./userService');
const User = require('./models/User');
const path = require('path'); // Require the 'path' module

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/dating_site')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Route for serving the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the index.html file from the 'public' directory
});

// Route for handling user sign-up
app.post('/signup', async (req, res) => {
    // Extract user data from the request body
    const { username, email, password } = req.body;

    try {
        // Check if user already exists in the database
        const existingUser = await userService.getUserProfileByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create a new user object
        const newUser = new User({ username, email, password });

        // Save the new user to the database
        await newUser.save();

        // Respond with a success message
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        // Log the error for debugging
        console.error('Error signing up user:', error);
        // Send an error response with a detailed message
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
// Route for handling user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Logging the username received from the request body
        console.log('Login request received for username:', username);

        // Check if the user exists and the password is correct
        const user = await userService.getUserProfileByUsername(username);

        // Logging the result of the query
        console.log('User found:', user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Passwords match, login successful
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in user:', error);

        // Send a detailed error response
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});





// Route for retrieving user profile by username
app.get('/profile/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const userProfile = await userService.getUserProfileByUsername(username);
        if (userProfile) {
            res.json(userProfile);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for retrieving user profile by email
app.get('/profile/email/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const userProfile = await userService.getUserProfileByEmail(email);
        if (userProfile) {
            res.json(userProfile);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
