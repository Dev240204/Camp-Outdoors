const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./Utils/ExpressError')
const campgrounds = require('./Routes/campgrounds');
const reviews = require('./Routes/reviews')
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const app = express();

// Mongoose Setup for Data Base Connection and Error Handling 
mongoose.set('strictQuery',true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log("Data base Connection Open!!");
    })
    .catch(()=>{
        console.log("Error in Connecting Data Base");
    })

// Express Setup for Parsing and Serving Static Files
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

// Ejs and Ejs-Mate Setup for Templating
app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// Session Setup for Flash Messages and Authentication 
const sessionConfig = {
    secret : 'thisisConfig',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

// Middleware for Flash Messages
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routes for Campgrounds and Reviews
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews)

// Passport Setup for Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Home Page
app.get('/',(req,res)=>{
    res.render('campgrounds/home');
})

// Error Page for Invalid Routes
app.all('*',(req,res,next)=>{
    next(new ExpressError("Page Not Found",404));
})

// Error Handler Middleware
app.use((err,req,res,next)=>{
    const {status = 500} = err;
    if(!err.message) err.message = "Something went wrong";
    res.status(status).render('error',{err});
})

app.listen(3000,()=>{
    console.log("Listening on port 3000!!");
})