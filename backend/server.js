// Importing required modules
const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const cors = require('cors'); // Importing cors module
const app = express();
const bodyParser = require("body-parser");

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Enable CORS for all origins (or specify your frontend URL)
// This will allow requests from all origins (e.g., localhost:3000).
app.use(cors());  // Allows CORS from all origins by default

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/userInfo", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Define the schema for User with a unique username
const contactSchema = new mongoose.Schema({
    Username: { 
        type: String, 
        required: true, 
        unique: true // Ensure the username is unique
    },
    Password: { 
        type: String, 
        required: true 
    },
});

// Create the Contact model
const Contact = mongoose.model("Contact", contactSchema);

// Route to handle user sign-up
app.post("/contact", async (req, res) => { 
    // Extract username and password from request body
    const { Username, Password } = req.body;

    // Basic validation for input fields
    if (!Username || !Password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Check if the username already exists in the database
        const existingContact = await Contact.findOne({ Username: Username });
        
        if (existingContact) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password asynchronously using bcrypt
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create new Contact (user) with the hashed password
        const contact = new Contact({
            Username: Username,
            Password: hashedPassword,  // Save the hashed password, not the plain one
        });

        // Save the new contact to the database
        await contact.save();

        // Respond with a success message
        res.json({ message: 'User created successfully' });

    } catch (err) {
        console.error('Error saving contact:', err);

        // Handle potential duplicate key error for unique constraint
        if (err.code === 11000) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Generic error response
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// Start the server
app.listen(5000, () => { 
    console.log("Server started on port 5000");
});
