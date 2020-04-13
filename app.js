var   express               = require("express"),
      mongoose              = require("mongoose"),
      passport              = require("passport"),
      bodyParser            = require("body-parser"),
      User                  = require("./models/user"),
      LocalStrategy         = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose")

var port = 3000
var app = express()

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/auth_demo_app';

mongoose.connect(databaseUri, { useNewUrlParser: true } )
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

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

// ROUTES

app.get("/", function(req, res){
	res.render("home");
});

app.get("/secret", function(req, res){
	res.render("secret");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  // the following require bodyParser
  console.log("username: " + req.body.username);
  console.log("password: " + req.body.password);
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render('register');
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secret");
    });
  });
});

app.listen(port, () => console.log('Auth demo app listening on port ' + port + '!'))
