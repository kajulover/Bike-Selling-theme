const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/bike-selling', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the database');
}).catch((err) => {
    console.error('Error connecting to the database:', err);
    process.exit();
});

// Create a User model
const User = mongoose.model('User', {
    username: String,
    password: String
});

// Create the Express app
const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the user exists in the database
    User.findOne({ username, password }, (err, user) => {
        if (err || !user) {
            res.redirect('/login');
        } else {
            req.session.user = user;
            res.redirect('/dashboard');
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.render('dashboard', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

// Create a Contact model
const Contact = mongoose.model('Contact', {
    name: String,
    email: String,
    message: String
});

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Create a new Contact document
    const contact = new Contact({ name, email, message });

    // Save the contact to the database
    contact.save((err) => {
        if (err) {
            console.error('Error saving contact:', err);
            res.redirect('/contact');
        } else {
            res.redirect('/contact-success');
        }
    });
});

app.get('/contact-success', (req, res) => {
    res.render('contact-success');
});
