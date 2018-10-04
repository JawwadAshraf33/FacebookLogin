const express = require("express");
const passport = require("passport");
const Strategy = require("passport-facebook").Strategy;

//create express app
var app = express();

// listen port

const port = process.env.PORT || 3000;
passport.use(
  new Strategy(
    {
      clientID: "337800060126774",
      clientSecret: "f71bc5a47880fa944082bfdf374d941c",
      callbackURL: "http://localhost:3000/login/facebook/return"
    },
    function(acessToken, refreshToken, profile, callback) {
      return callback(null, profile);
    }
  )
);
passport.serializeUser(function(user, callback) {
  callback(null, user);
});

passport.deserializeUser(function(obj, callback) {
  callback(null, obj);
});

//set view dir
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "lco app",
    resave: true,
    saveUninitialized: true
  })
);

//@route   -   GET   /home
//@desc     -   a route to home page
//@access   -   PUBLIC
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

//@route   -   GET   /login
//@desc     -   a route to login
//@access   -   PUBLIC
app.get("/login", (req, res) => {
  res.render("login");
});

//@route   -   GET   /login/facebook
//@desc     -   a route to facebook auth
//@access   -   PUBLIC
app.get("/login/facebook", passport.authenticate("facebook"));

//@route   -   GET   /login/facebook/callback
//@desc     -   a route to home when error with facebook
//@access   -   PUBLIC
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

//@route   -   GET   /profile
//@desc     -   a route to profile of user
//@access   -   Private
app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn(),
  (req, res) => {
    res.render("profile.js", { user: req.user });
  }
);

app.listen(port);
