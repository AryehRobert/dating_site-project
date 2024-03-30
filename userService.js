// userService.js

const User = require('./models/User'); // Import the User model

// Function to retrieve user profile by username
async function getUserProfileByUsername(username) {
    try {
        const user = await User.findOne({ username });
        return user;
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        throw error;
    }
}

// Function to retrieve user profile by email
async function getUserProfileByEmail(email) {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        throw error;
    }
}

// Export the functions
module.exports = {
    getUserProfileByUsername,
    getUserProfileByEmail
};
