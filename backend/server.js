// Importing required modules
const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const cors = require('cors'); // Importing cors module
const app = express();
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

// For the purposes of making this easier to use while developing and allowing
// ease of use for grading in this class we are not hiding the SECRET_KEY.
// In an actual situation we would want this completely hidden, probably in an
// environment variable.
const SECRET_KEY = '9995c54a0d9b41cd38286daaf84be08f9e1ff76e4d04ffb3e3470a19f11d4a592164c6ba28d06536a6814790eaa8eabd4ad34eb09469a80d10f9bb33160502ad'; 

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
    DateCreated: { 
        type: Date, default: Date.now, 
        required: true 
    },
    Score: {
        type: Number
    },
});

// Create the Contact model
const Contact = mongoose.model("Contact", contactSchema);

// Route to handle user sign-up
app.post("/contact", async (req, res) => { 
    const { Username, Password } = req.body;

    if (!Username || !Password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const existingContact = await Contact.findOne({ Username: Username });
        
        if (existingContact) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password asynchronously using bcrypt
        const hashedPassword = await bcrypt.hash(Password, 10);

        const contact = new Contact({
            Username: Username,
            Password: hashedPassword,  // Save the hashed password, not the plain one
        });

        await contact.save();

        res.json({ message: 'User created successfully' });

    } catch (err) {
        console.error('Error saving contact:', err);
        
        if (err.code === 11000) {
            return res.status(400).json({ message: "Username already exists" });
        }

        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// Add the Login route
app.post("/login", async (req, res) => {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Find the user by username
        const user = await Contact.findOne({ Username: Username });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Successfully logged in
        const token = jwt.sign({ username: user.Username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

app.delete("/deleteAccount", async (req, res) => {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const user = await Contact.findOne({ Username: Username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        await Contact.deleteOne({ Username: Username });

        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error("Error during account deletion:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Extract token from the Authorization header
  
    if (!token) {
        return res.sendStatus(401);  // No token, unauthorized
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);  // Invalid token, forbidden
        }
        req.user = user;  // Store user info in the request object
        next();  // Proceed to the next middleware or route handler
    });
};
  
// Profile route that requires authentication
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await Contact.findOne({ Username: req.user.username });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            username: user.Username,
            score: user.Score || "No score yet",  // Send "No score yet" if the score is null
        });
    } catch (err) {
        console.error("Error fetching profile data:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Start the server
app.listen(5000, () => { 
    console.log("Server started on port 5000");
});
