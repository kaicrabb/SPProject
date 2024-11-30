// Importing required modules
const express = require('express');
const bcrypt = require('bcryptjs'); // Import bcrypt for encryption
const mongoose = require("mongoose"); // Import mongoose for the database
const cors = require('cors'); // Importing cors module
const app = express();
const bodyParser = require("body-parser"); // Import body-parser for middleware
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for tokenization
const dayjs = require('dayjs'); // Import dayjs for properly storing dates in database

// For the purposes of making this easier to use while developing and allowing
// ease of use for grading in this class we are not hiding the SECRET_KEY.
// In an actual situation we would want this completely hidden, probably in an
// environment variable.
const SECRET_KEY = '9995c54a0d9b41cd38286daaf84be08f9e1ff76e4d04ffb3e3470a19f11d4a592164c6ba28d06536a6814790eaa8eabd4ad34eb09469a80d10f9bb33160502ad'; 

app.use(express.static('public'));  // Serve static files from the 'public' folder

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
// turn on the mongodb connection
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Define the schema for a user
const contactSchema = new mongoose.Schema({
    Username: { // requires users to create/have an account to login/signup
        type: String, 
        required: true, 
        unique: true // Ensure the username is unique
    },
    Password: { // requires users to create/have a password to login/signup
        type: String, 
        required: true 
    },
    DateCreated: { //logs the date that an account was made
        type: String, default: () => dayjs().format('YYYY-MM-DD'), 
        required: true 
    },
    Score: { // Score from the game
        type: Number
    },
    selectedCharacter: { // saves character image path from character select
        type: String
    },
    deadSprite: { // saves character death image path from character selec
        type: String
    },
    legacy: {// will be used so that old accounts are not locked out due to added password/username requirements
        type: Boolean, default: false 
    },
});

// Create the Contact model
const Contact = mongoose.model("Contact", contactSchema);

// Route to handle user sign-up
app.post("/contact", async (req, res) => { 
    const { Username, Password } = req.body;

    if (!Username || !Password) { // Print an error message if signup is missing username or password
        return res.status(400).json({ message: "Username and password are required" });
    }
    // If a username and password are inputted continue
    try {
        const existingContact = await Contact.findOne({ Username: Username }); // check for an account with inputted name
        
        if (existingContact) { // If an account exists with that username give an error
            return res.status(400).json({ message: "Username is invalid" });
        }

        // Hash the password asynchronously using bcrypt
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Save the information to new contact in the database
        const contact = new Contact({
            Username: Username,
            Password: hashedPassword,  // Save the hashed password, not the plain one
        });

        await contact.save(); //wait for the contact to be saved before continuing

        // Give the user a token for 1 hr 
        const token = jwt.sign({ username: contact.Username }, SECRET_KEY, { expiresIn: '1h' });

        //Send back a message that the user created their account, send token to the client
        res.json({ message: 'User created successfully', token });

    } catch (err) { //check for other errors with saving the user data
        console.error('Error saving contact:', err);
        
        if (err.code === 11000) { // error out if username exists already
            return res.status(400).json({ message: "Username already exists" });
        }
        // return an error with the error message
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// Add the Login route
app.post("/login", async (req, res) => {
    const { Username, Password } = req.body;

    if (!Username || !Password) { // Check that user inputted both a Username and Password
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Password validation: at least 8 characters, one symbol, one uppercase, one lowercase
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Try to log the user in
    try {
        // Find the user by username
        const user = await Contact.findOne({ Username: Username });

        if (!user) { 
            // Check if the user doesn't exist, and tell them that the password or username is incorrect,
            // don't want to give the user specific information in case it is an attacker
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) { // If the password doesn't match, return an error
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Check if the password meets new strong criteria
        const isLegacy = !strongPasswordRegex.test(Password);

        // If it's a legacy password, mark the user as legacy, but still allow them to log in
        if (isLegacy && !user.legacy) {
            user.legacy = true;
            await user.save();
        }

        // Successfully logged in, generate a token (whether legacy or not)
        const token = jwt.sign({ username: user.Username }, SECRET_KEY, { expiresIn: '1h' });

        res.json({
            token,
            passwordStrength: isLegacy ? 'legacy' : 'strong',  // Send the legacy status
            message: 'Login successful!',
        });
    } catch (err) { // Error handling for unexpected issues
        console.error("Error during login:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});




//Add deleteAccount route
app.delete("/deleteAccount", async (req, res) => {
    const { Username, Password } = req.body;

    if (!Username || !Password) { // Make sure the both username and password are sent
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Try to delete the account
    try { 
        const user = await Contact.findOne({ Username: Username });

        if (!user) { // Do nothing if the account inputted doesn't exist
            return res.status(404).json({ message: "User not found" });
        }
        // compare the inputted password to the hashed stored password 
        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) { // if the password hashes don't match do nothing return invalid password message
            return res.status(401).json({ message: "Invalid password" });
        }
        // delete the account
        await Contact.deleteOne({ Username: Username });
        res.json({ message: "Account deleted successfully" });
    } catch (err) {// catch any errors that occur during deletion
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
app.post('/update-password', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Find the user based on their Username
        const user = await Contact.findOne({ Username: req.user.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid old password' });
        }

        // Validate new password
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPasswordRegex.test(newPassword)) {
            return res.status(400).json({ message: 'New password does not meet the requirements (min 8 characters, 1 symbol, 1 uppercase, 1 lowercase)' });
        }

        // Update password if valid
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.Password = hashedPassword;

        // Reset legacy flag if applicable
        if (user.legacy) {
            user.legacy = false;  // Reset legacy flag if user has legacy status
        }

        // Save the updated user data
        await user.save();

        res.status(200).json({ message: 'Password updated successfully!' });

    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
  
// Profile route
app.get('/profile', authenticateToken, async (req, res) => {
    try { // Try to find an account and fetch its data
        const user = await Contact.findOne({ Username: req.user.username });
        
        if (!user) { // Check to make sure a user was found
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ // send the userdata we want sent
            username: user.Username,
            score: user.Score || "No score yet",  // Send "No score yet" if the score is null
            joined: user.DateCreated,
        });
    } catch (err) { // check for any errors occuring during profile fetch
        console.error("Error fetching profile data:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Submit a score to the database based off the score in the game
app.post('/submit-score', authenticateToken, async (req, res) => {
    // get the score from the game
    const { score } = req.body;
    
    try { // Try to submit a score
        console.log('Looking for user with userId:', req.user.username);  // Log userId for debugging
        const user = await Contact.findOne({ Username: req.user.username })  // Get userId from the token 
        
        if (!user) { // find the user
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.Score){ // send the score into the database if the user doesn't already have a saved score
            user.Score = score;
            await user.save();
            return res.json({message: 'Score added'})
        }
        // Check if the new score is higher than the existing score and save it if so
        if (score > user.Score) {
            user.Score = score;
            await user.save();
            return res.json({ message: 'Score updated successfully!' });
        }
        // don't save the score if its lower than the old one
        res.json({ message: 'Score is not higher than the current score.' });
    } catch (err) { // check for error in sending the score
        console.error('Error updating score:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});
// Save a selected character to the database
app.post('/submit-character', authenticateToken, async (req, res) => {
    const { character, deadSprite } = req.body; // get the the selected character sprite and dead-sprite

    if (!character || !deadSprite) { // send message if no character is selected
        return res.status(400).json({ message: 'Character and deadSprite are required.' });
    }

    try { // try to save the character
        console.log('Looking for user with username:', req.user.username); // Debug log
        const user = await Contact.findOne({ Username: req.user.username }); // Replace `Username` with your field name

        if (!user) { // check if the user exists
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update the character and dead sprite in the database
        user.selectedCharacter = character;
        user.deadSprite = deadSprite;

        await user.save(); // save the sprites

        return res.json({ message: 'Character selection saved successfully!' });
    } catch (err) { // check for the errors on character selection
        console.error('Error saving character selection:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//Get the character and pull them into the game
app.get('/get-character', authenticateToken, async (req, res) => {
    try { // try pulling the character in
        console.log('Looking for user with username:', req.user.username); // Debug log
        
        // Find the user from the database
        const user = await Contact.findOne({ Username: req.user.username }); // Replace `Username` with your field name

        console.log('user is: ', user);
        if (!user) { // check if a user is still selected
            return res.status(404).json({ message: 'User not found.' });
        }

        // Send the character and deadSprite back as a response
        return res.json({
            selectedCharacter: user.selectedCharacter,
            deadSprite: user.deadSprite
        });
    } catch (err) { // catch errors and send them back
        console.error('Error retrieving character data:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Start the server
app.listen(5000, () => { 
    console.log("Server started on port 5000");
});
