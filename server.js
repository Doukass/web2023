const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const path = require("path");
const db = require('./database');
const app = express();
const port = 3000;
const { pool } = require('./database');
app.use(express.json());
app.use(express.static("express"));



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static')); //gia prospelash tou css
app.set('view engine', 'ejs');

app.use(session({
  secret: 'secret',
  //cookie: { maxAge: 100000000 },
  resave: false,
  saveUninitialized: false
}));
app.use(flash());


//flash message middleware
app.use((req, res, next) => {
  res.locals.message = req.session.message
  delete req.session.message
  next()
})

app.get('/', (req, res) => {
  res.render('login', { message: flash('success', 'error') });
});
app.get('/login.ejs', (req, res) => {
  res.render('login')
});
app.get('/signup.ejs', (req, res) => {
  res.render('signup')
});


app.get('/home.ejs', (req, res) => {
  res.render('home')
});

app.get('/proxeiro.ejs', (req, res) => {
  res.render('proxeiro')
});




//registration handler
app.post("/register", async (req, res) => {

  let errors = [];

  console.log(req.body.email)
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let secpassword =req.body.secpassword;

  console.log({
    email,
    username,
    password
  });


  if (!email || !username || !password || !secpassword) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long." });
  }
  if (password.match(/[a-z]+/) == null) {
    errors.push({ message: "Passwords must contain at least a small letter." });
  }
  if (password.match(/[A-Z]+/) == null) {
    errors.push({ message: "Passwords must contain at least one capital letter." });
  }
  if (password.match(/[0-9]+/) == null) {
    errors.push({ message: "Passwords must contain at least one number." });
  }
  if (password.match(/[$@#&!]+/) == null) {
    errors.push({ message: "Passwords must contain at least one symbol ($@#&!)" });
  }

  if (password !== secpassword) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("signup", { errors, email, username, password, secpassword });
  } else {


    // Validation passed
    pool.query(
      `SELECT * FROM users WHERE email = ?  OR username = ?`,[email,username],
      function(err, results){
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.length > 0) {
          req.flash('error', 'Email or username already in use');
          return res.render('signup');

        } else {
          pool.query(
            "INSERT INTO users (username, password, email) VALUES (?,?,?)", [username, password, email],
            //RETURNING user_ID, password`, 
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);

              res.render('login');
            }
          );
        }
      }
    )
  }
});



//login handler
app.post("/login/home", async (req, res) => {
  let { username, password } = req.body;

  const sql = "SELECT username FROM users WHERE username = $1 and password = $2"
  const result = await pool.query(sql,
    [req.body.username, req.body.password]);


  if (username == "admin" && password == "adminadmin") {
    res.redirect('/login/admin')

  }
  //fail
  if (result.rowCount === 0) {
    req.flash('error', 'Your username or password is wrong. ');
    res.redirect('/');
  }
  else {
    req.flash('success', 'You are now logged in. ')
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    res.render('home');
  }
});




// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));

