const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const dbConnection = require('./database');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));




// Set our views and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Apply cookie session middleware
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 3600 * 1000 // 1hr
}));

// Declaring custom middleware
const ifNotLoggedin = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.render('login-register');
  }
  next();
};

const ifLoggedin = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/home');
  }
  next();
};

// Root page
app.get('/', ifNotLoggedin, (req, res, next) => {
  dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?", [req.session.userID])
    .then(([rows]) => {
      res.render('home', { name: rows[0].name });
    });
}); // END OF ROOT PAGE

// Register page
app.post(
  '/register',
  ifLoggedin,
  // Post data validation (using express-validator)
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
    body('password', 'The password must be of minimum length 8 characters').trim().isLength({ min: 8 }),
    body('password', 'The password must contain at least one uppercase letter').trim().not().isLowercase(),
    body('password', 'The password must contain at least one number').trim().matches(/\d/),
    body('password', 'The password must contain at least one special character').matches(/[!@#$%^&*(),.?":{}|<>]/)
  ],// end of post data validation

  (req, res, next) => {
    const validation_result = validationResult(req);
    const { username, password, email } = req.body;
    // If validation_result has no errors
    if (validation_result.isEmpty()) {
      // Password encryption (using bcryptjs)
      bcrypt.hash(password, 12).then((hash_pass) => {
        // Inserting user into database
        dbConnection.execute("INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)", [username, email, hash_pass])
          .then(result => {
            res.send(`Your account has been created successfully. Now you can <a href="/">Login</a>`);
          })
          .catch(err => {
            // Throw inserting user errors
            if (err) throw err;
          });
      })
      .catch(err => {
        // Throw hashing errors
        if (err) throw err;
      });
    } else {
      // Collect all the validation errors
let allErrors = validation_result.errors.map((error) => {
  return error.msg;
});

// RENDER login-register PAGE WITH VALIDATION ERRORS
res.render('login-register', {
  register_error: allErrors,
  old_data: req.body
});
}
}) // END OF REGISTER PAGE

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
  const { password, username } = req.body;

  if (validation_result.isEmpty()) {
    dbConnection.execute("SELECT * FROM `users` WHERE `name`=?", [username])
      .then(([rows]) => {
        bcrypt.compare(password, rows[0].password).then(compare_result => {
          if (compare_result === true) {
            req.session.isLoggedIn = true;
            req.session.userID = rows[0].id;
            res.redirect('/');
          } else {
            res.render('login-register', { login_errors: ['Invalid Password!'] });
          }
        }).catch(err => { if (err) throw err; });
      }).catch(err => { if (err) throw err; });
  } else {
    let allErrors = validation_result.errors.map((error) => {
      return error.msg;
    });

    // RENDER login-register PAGE WITH LOGIN VALIDATION ERRORS
    res.render('login-register', { login_errors: allErrors });
  }
}); // END OF LOGIN PAGE

// LOGOUT
app.get('/logout', (req, res) => {
  //session destroy
  req.session = null;
  res.redirect('/');
}); // END OF LOGOUT




app.get("/users/map/stores", async (req, res) => {
  console.log("handling Get req for users/map/stores");

  try {
    const [results, fields] = await dbConnection.execute('SELECT store_name, store_latitude, store_longitude FROM stores');
    console.log("Query returned ${results.length} results:");
    console.log(results);

    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching stores");
  }
});
















app.use('/', (req, res) => {
  res.status(404).send('<h1>404 Page Not Found!</h1>');
});











app.listen(3000, () => console.log("Server is Running..."));
