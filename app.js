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

//app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
        if(err){
        	console.log("ERROEE BLOCK");
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
        console.log("authentocate BLOCK");
           //req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/secret"); 
        });
    });
});

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}) ,function(req, res){
});

app.listen(port, () => console.log('Auth demo app listening on port ' + port + '!'))
