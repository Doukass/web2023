const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const dbConnection = require('./database');
const {
  body,
  validationResult
} = require('express-validator');

const app = express();
app.use(express.urlencoded({
  extended: false
}));

app.use(express.static('public'));


// SET OUR VIEWS AND VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// APPLY COOKIE SESSION MIDDLEWARE
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 3600 * 1000 // 1hr
}));

// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.render('login-register');
  }
  next();
}

const ifLoggedin = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/home');
  }
  next();
}
// END OF CUSTOM MIDDLEWARE

// ROOT PAGE
app.get('/', ifNotLoggedin, (req, res, next) => {
  dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?", [req.session.userID])
    .then(([rows]) => {
      res.render('home', {
        name: rows[0].name
      });
    });

}); // END OF ROOT PAGE


// REGISTER PAGE
app.post('/register', ifLoggedin,
  // post data validation(using express-validator)
  [
    body('email', 'Invalid email address!').isEmail().custom((value) => {
      return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
        .then(([rows]) => {
          if (rows.length > 0) {
            return Promise.reject('This E-mail already in use!');
          }
          return true;
        });
    }),
    body('username', 'Username is Empty!').trim().not().isEmpty(),
    body('password', 'The password must be of minimum length 8 characters').trim().isLength({ min:8 }),
    body('password', 'The password must contain at least one uppercase letter').trim().not().isLowercase(),
    body('password', 'The password must contain at least one Number').trim().matches(/\d/),
    body('password', 'The password must contain at least one special character').matches(/[!@#$%^&*(),.?":{}|<>]/)

  ], // end of post data validation/
  (req, res, next) => {

    const validation_result = validationResult(req);
    const {
      username,
      password,
      email
    } = req.body;
    // IF validation_result HAS NO ERROR
    if (validation_result.isEmpty()) {
      // password encryption (using bcryptjs)
      bcrypt.hash(password, 12).then((hash_pass) => {
          // INSERTING USER INTO DATABASE
          dbConnection.execute("INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)", [username, email, hash_pass])
            .then(result => {
              res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`);
            }).catch(err => {
              // THROW INSERTING USER ERROR'S
              if (err) throw err;
            });
        })
        .catch(err => {
          // THROW HASING ERROR'S
          if (err) throw err;
        })
    } else {
      // COLLECT ALL THE VALIDATION ERRORS
      let allErrors = validation_result.errors.map((error) => {
        return error.msg;
      });
      // REDERING login-register PAGE WITH VALIDATION ERRORS
      res.render('login-register', {
        register_error: allErrors,
        old_data: req.body
      });
    }
  }); // END OF REGISTER PAGE

// LOGIN PAGE
app.post('/', ifLoggedin, [
  body('username').custom((value) => {
    return dbConnection.execute('SELECT `name` FROM `users` WHERE `name`=?', [value])
      .then(([rows]) => {
        if (rows.length == 1) {
          return true;

        }
        return Promise.reject('Invalid Username!');

      });
  }),
  body('password', 'Password is empty!').trim().not().isEmpty(),
], (req, res) => {
  const validation_result = validationResult(req);
  const {
    password,
    username
  } = req.body;
  if (validation_result.isEmpty()) {

    dbConnection.execute("SELECT * FROM `users` WHERE `name`=?", [username])
      .then(([rows]) => {
        // console.log(rows[0].password);
        bcrypt.compare(password, rows[0].password).then(compare_result => {
            if (compare_result === true) {
              req.session.isLoggedIn = true;
              req.session.userID = rows[0].id;

              res.redirect('/');
            } else {
              res.render('login-register', {
                login_errors: ['Invalid Password!']
              });
            }
          })
          .catch(err => {
            if (err) throw err;
          });


      }).catch(err => {
        if (err) throw err;
      });
  } else {
    let allErrors = validation_result.errors.map((error) => {
      return error.msg;
    });
    // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
    res.render('login-register', {
      login_errors: allErrors
    });
  }
});
// END OF LOGIN PAGE

// LOGOUT
app.get('/logout', (req, res) => {
  //session destroy
  req.session = null;
  res.redirect('/');
});
// END OF LOGOUT

app.use('/', (req, res) => {
  res.status(404).send('<h1>404444 Page Not Found!</h1>');
});

app.listen(3000, () => console.log("Server is Running..."));