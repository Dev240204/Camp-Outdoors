if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./Utils/ExpressError");
const campgroundsRoutes = require("./Routes/campgrounds");
const reviewsRoutes = require("./Routes/reviews");
const userRoutes = require("./Routes/users");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp"

// Mongoose Setup for Data Base Connection and Error Handling

mongoose.set("strictQuery", true);
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Data base Connection Open!!");
  })
  .catch(() => {
    console.log("Error in Connecting Data Base");
  });

const app = express();

// Ejs and Ejs-Mate Setup for Templating
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Express Setup for Parsing and Serving Static Files
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

// Session Setup for Flash Messages and Authentication
const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret
  }
});

store.on('error',function(e){
  console.log("Session Store Error",e)
})

const sessionConfig = {
  store,
  name : 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure : true
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// Passport Setup for Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for Flash Messages
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes for Campgrounds and Reviews
app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews",reviewsRoutes);

// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// Error Page for Invalid Routes
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong";
  }
  res.status(status).render("error", { err });
});

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
