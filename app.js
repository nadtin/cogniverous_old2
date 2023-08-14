const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User'); // Assuming you have a User model
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const port = 3000;

// Initialize View Engine
app.set('view engine', 'ejs');


// Enable express to handle sessions
app.use(require('express-session')({ secret: 'secret key', resave: false, saveUninitialized: false }));


app.use(require('body-parser').urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Enable flash messages
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setup body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://nodejs:password@127.0.0.1:27017/cogs_db', { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})

.then(() => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.error("Could not connect to MongoDB", err);
});

// Home page
app.get('/', (req, res) => {
    res.send('Welcome to Home Page!');
});

// Login form
app.get('/login', function(req, res){
    const message = req.flash('error');
    res.render('login', { message: message.length > 0 ? message : '' });
  });
  
  

// Post login
app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { 
        req.flash('error', 'Invalid username or password.');
        return res.redirect('/login'); 
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/home');
      });
    })(req, res, next);
  });
  

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
