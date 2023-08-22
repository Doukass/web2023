const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const dbConnection = require('./database');
const { body, validationResult } = require('express-validator');
const { name } = require('ejs');

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
  dbConnection.execute("SELECT name FROM users WHERE id=?", [req.session.userID])
    .then(([rows]) => {
      res.render('home', { name: rows[0].name });
    });
}); // END OF ROOT PAGE




















// sthn selida tou profile emfanizoyme plhrogories opws name, email

app.get('/profile', ifNotLoggedin, (req, res, next) => {
  dbConnection.execute("SELECT name, password FROM users WHERE id=?", [req.session.userID])
    .then(([rows]) => {
      res.render('profile', { name: rows[0].name, password:rows[0].password });
    });
});
    
   
  
  











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
    return dbConnection.execute('SELECT name FROM users WHERE name=?', [value])
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
    dbConnection.execute("SELECT * FROM users WHERE name=?", [username])
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







//app.get('/profile', (req,res) => {
//  res.render('profile')
//});


//-------------------
//ALLAGH username kai password


app.post("/home/profile", async (req, res) => {
  let { newname, newpassword, secpassword } = req.body;

  let errors = [];

  console.log({
    newname,
    newpassword,
    secpassword
  });

  if (!newname || !newpassword || !secpassword) {
    errors.push({ message: "Please enter all fields" });
  }

  if (newpassword.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long." });
  }
  if (newpassword.match(/[a-z]+/) == null){
    errors.push({ message: "Passwords must contain at least a small letter." });
  }
  if (newpassword.match(/[A-Z]+/) == null) {
    errors.push({ message: "Passwords must contain at least one capital letter." });
  }
  if (newpassword.match(/[0-9]+/) == null) {
    errors.push({ message: "Passwords must contain at least one number." });
  }
  if (newpassword.match(/[$@#&!]+/) == null) {
    errors.push({ message: "Passwords must contain at least one symbol ($@#&!)" });
  }

  if (newpassword !== secpassword) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("profile", { name: req.session.name, password: req.session.password, errors, newname, newpassword, secpassword });
  } else {
    // Validation passed
    dbConnection.execute(
      `UPDATE users SET name = $1, password = $2
          WHERE name = $3 AND password = $4`,
      [newname, newpassword, req.session.name, req.session.password],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log(results.rows);
          req.session.name = newname;
          req.session.password = newpassword;
          req.flash("success", "Your information changed succesfully");
          res.render('profile', { name: newname, password: newpassword });
        }
      }
    );
  }
});





















//-------------------------















// LOGOUT
app.get('/logout', (req, res) => {
  //session destroy
  req.session = null;
  res.redirect('/');
}); // END OF LOGOUT

// alagess ston kwdikaaaa---------


app.get("/users/map/stores", async (req, res) => {
 // console.log("handling Get req for users/map/stores");

    //to try catch pou eixame se ayto to shmeio den xreazetai
    //genika try catch xrhsimopoioyme mono gia na doyme ean ena kommati tou kwdika leitoyrgei
    //ara mporoume na to xreisimopoioyme sthn arxh gia na doume ean to kommati tou kwdika poy theloume douleuei kai meta to sbhnoume
    //se ayto to shmeio to problhma pou eixame lythike me thn xrhsh async kai await.

  
    const [results, fields] = await dbConnection.execute('SELECT stores.store_name, stores.store_latitude, stores.store_longitude, stores.discount_on, discount.store_id, discount.product_id, discount.price, discount.date_entered, products.name FROM stores LEFT JOIN discount ON stores.store_id = discount.store_id LEFT JOIN products ON discount.product_id = products.product_id;');
    //ta parakatw console tha amfanistoyn mono sto terminal tou VSC
    //console.log("Query returned ${results.length} results:");
    //console.log(results);
    
   //sthn parakatw entolh stelnoume ston client to results
    res.send(results);

});



app.get("/users/map/search", async (req, res)=> {
  
   const [results, fields] = await dbConnection.execute('SELECT stores.store_name, stores.store_latitude, stores.store_longitude, discount.store_id, discount.product_id FROM stores INNER JOIN discount ON stores.store_id = discount.store_id');
  //console.log("Query returned ${results.length} results:");
   console.log(results);
   res.send(results);
   
});











//--------


// giati exei mpei h parakatw malakia
//gtxm
//app.use('/', (req, res) => {
//  res.status(404).send('<h1>404 Page Not Found!!!!!!</h1>');
//});

//-----------









app.listen(3000, () => console.log("Server is Running..."));
