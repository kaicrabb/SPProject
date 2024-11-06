//Express
const express = require('express')
const app = express()

app.get("/api", (req, res) => {
    res.json({ "users": ["Kai Crabb", "Elijah Carney", "Christopher Carter", "John Pork"] })
})

app.listen(5000, () => { console.log("Server started on port 5000")})

//Mongo
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/userInfo");
    /*{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });*/
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    });
      

const contactSchema = {
    Username: String,
    Password: String,
};

const Contact = mongoose.model("Contact", contactSchema);
app.post("/contact", function (req, res) {
    const contact = new Contact({
        Username: req.body.Username,
        Password: req.body.Password,
    });
    contact.save(function (err) {
        if (err) {
            res.redirect("/error");
        } else {
            res.redirect("/thank-you");
        }
    });
 });