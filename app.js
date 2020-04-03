const express               = require("express"),
      mongoose              = require("mongoose")
      passport              = require("passport"),
      bodyParser            = require("body-parser"),
      User                  = require("./models/user"),
      LocalStrategy         = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose")
const port = 3000
const app = express()

//const mongoose = require("mongoose")
//mongoose.connect("mongodb://localhost/auth_demo_app");

app.set('view engine', 'ejs');

app.use(require("express-session")({
	secret: "The quick brown fox jumps up and down",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//passport.serializeUser(User,serializeUser());
//passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.get("/", function(req, res){
	res.render("home");
});

app.get("/secret", function(req, res){
	res.render("secret");
});

app.listen(port, () => console.log('Auth demo app listening on port ' + port + '!'))
