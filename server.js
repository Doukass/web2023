const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const dbConnection = require('./database');
const { body, validationResult } = require('express-validator');
const { name } = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { error } = require('console');




const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(bodyParser.json());



// Set our views and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Apply cookie session middleware
// na moy to ekshghsei o teo
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

app.get('/', ifNotLoggedin, (req, res, next) => {
  dbConnection.execute("SELECT name FROM users WHERE id=?", [req.session.userID])
    .then(([rows]) => {
      if (rows[0].name === 'admin') {
        res.render('admin', { name: rows[0].name }); // Render admin.ejs for admin
      } else {
        res.render('home', { name: rows[0].name }); // Render home.ejs for non-admin users
      }
    });
}); 




















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
      dbConnection.execute("INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)", [username, email, password])
        .then(result => {
            res.send(`Your account has been created successfully. Now you can <a href="/">Login</a>`);
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
            if (rows.length === 0) {
                res.render('login-register', { login_errors: ['User not found.'] });
            } else if (rows[0].password === password) {
                req.session.isLoggedIn = true;
                req.session.userID = rows[0].id;
                res.redirect('/');
            } else {
                res.render('login-register', { login_errors: ['Invalid Password!'] });
            }
        }).catch(err => {
            // Handle database query errors
            if (err) throw err;
        });
}

  
  else {
    let allErrors = validation_result.errors.map((error) => {
      return error.msg;
    });

    // RENDER login-register PAGE WITH LOGIN VALIDATION ERRORS
    res.render('login-register', { login_errors: allErrors });
  }
}); // END OF LOGIN PAGE










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
      `UPDATE users SET name = ?, password = ?
          WHERE name = ? AND password = ?`,
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

  
    const [results, fields] = await dbConnection.execute('SELECT COALESCE(stores.store_name, "Unknown") AS store_name, stores.store_latitude, stores.store_longitude, stores.discount_on, COALESCE(discount.store_id, "Unknown") AS store_id, COALESCE(discount.product_id, "Unknown") AS product_id, COALESCE(discount.price, "Unknown") AS price, COALESCE(discount.date_entered, "Unknown") AS date_entered, discount_id AS discount_id,COALESCE(products.name, "Unknown") AS product_name, COALESCE(category.name, "Unknown") AS category_name, COALESCE(users.name, "Unknown") AS user_name FROM stores LEFT JOIN discount ON stores.store_id = discount.store_id LEFT JOIN products ON discount.product_id = products.product_id LEFT JOIN category ON products.category_id = category.category_id LEFT JOIN users ON discount.user_id = users.id;');
    //ta parakatw console tha amfanistoyn mono sto terminal tou VSC
    //console.log("Query returned ${results.length} results:");
    //console.log(results);
    
   //sthn parakatw entolh stelnoume ston client to results
    res.send(results);

});



app.get("/users/map/search", async (req, res)=> {
  
   const [results, fields] = await dbConnection.execute('SELECT stores.store_name, stores.store_latitude, stores.store_longitude, discount.store_id, discount.product_id,   FROM stores INNER JOIN discount ON stores.store_id = discount.store_id');
  //console.log("Query returned ${results.length} results:");
   //console.log(results);
   res.send(results);
   
});



app.get("/users/map/category", async (req, res)=> {
  
  const [results, fields] = await dbConnection.execute('SELECT  c.name AS category_name,  s.subcategory_id, s.name AS subcategory_name,  p.name AS product_name, p.product_id AS product_id FROM  products p JOIN  subcategory s ON p.subcategory_id = s.subcategory_id JOIN  category c ON s.category_id = c.category_id;');
 //console.log("Query returned ${results.length} results:");
  //console.log(results);
  res.send(results);
  
});





app.get("/users/map/aksiologhsh", async (req, res)=> {
  
  const [results, fields] = await dbConnection.execute('SELECT stores.store_name, stores.store_latitude, stores.store_longitude, stores.discount_on, discount.store_id, discount.product_id, discount.discount_id ,discount.price, discount.date_entered, products.name AS product_name, users.name AS user_name FROM stores LEFT JOIN discount ON stores.store_id = discount.store_id LEFT JOIN users ON discount.user_id = users.id LEFT JOIN products ON discount.product_id = products.product_id;');
 //console.log("Query returned ${results.length} results:");
  //console.log(results);
  res.send(results);
  
});



app.get("/admin/chart1", async (req, res)=> {
  
  const [results, fields] = await dbConnection.execute('date_entered FROM discount');
 //console.log("Query returned ${results.length} results:");
  
  res.send(results);
  
});




//-------- upload likes

app.post('/update/like', (req, res) => {
  const { discount_id  } = req.body;

const sql = 'INSERT INTO like ( user_id, discount_id  VALUES (?, ?))' 

dbConnection.query(sql,[req.session.userID, discount_id ], (error,results)=> {
  if (error) {
    console.error('Error inserting data into the database:', error);
    res.status(500).json({ error: 'An error occurred while updating data' });
  } else {
    console.log('Data inserted successfully');
    res.status(200).json({ message: 'Data inserted successfully' });
  }
});
  
});


//-------- upload discount


app.post('/updateData', (req, res) => {
  const { product_id, store_id, enteredPrice } = req.body;


  // Create an SQL query to insert the data into the database
  const sql = 'INSERT INTO discount (user_id, product_id, store_id, price, date_entered, like_counter) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 0)';
  
  // Execute the SQL query
  dbConnection.query(sql, [req.session.userID, product_id, store_id, enteredPrice], (error, results) => {
    if (error) {
      console.error('Error inserting data into the database:', error);
      res.status(500).json({ error: 'An error occurred while updating data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});














//----------

// giati exei mpei h parakatw malakia
//gtxm
//app.use('/', (req, res) => {
//  res.status(404).send('<h1>404 Page Not Found!!!!!!</h1>');
//});

//-----------

//------ update database -----------//
app.post('/update-database', (req, res) => {
  const jsonData = req.body;

  const insertQuery = `
    INSERT INTO prices (product_id, latest_date, price1, price2, price3, price4, price5, price_avg)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      latest_date = VALUES(latest_date),
      price1 = VALUES(price1),
      price2 = VALUES(price2),
      price3 = VALUES(price3),
      price4 = VALUES(price4),
      price5 = VALUES(price5),
      price_avg = VALUES(price_avg)
  `;

  for (const item of jsonData.data) {
    const { product_id, prices } = item;

    //const latestPrice = prices[prices.length - 1].price;
    const priceValues = prices.map(price => price.price);
    const priceAvg = priceValues.reduce((total, price) => total + price, 0) / priceValues.length;

    dbConnection.query(insertQuery, [product_id, new Date(), ...priceValues, priceAvg], (error, results) => {
      if (error) {
        console.error('Error updating database:', error);
        res.status(500).json({ error: 'Database update failed' });
        return;
      }
    });
  }

  res.json({ message: 'Database updated successfully' });
});


app.post('/update-database1', (req, res) => {
  const jsonData1 = req.body;

  const insertQuery1 = `
    INSERT INTO stores (store_id, store_name, discount_on, store_latitude, store_longitude)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      store_id = VALUES(store_id),
      store_name = VALUES(store_name),
      discount_on = VALUES(discount_on),
      store_latitude = VALUES(store_latitude),
      store_longitude = VALUES(store_longitude)
  `;

  for (const item of jsonData1.features) {
    const {
      "@id": id,
      name: store_name,
      discount_on = 0, //because the json file does not have it 
    } = item.properties;

    //take only the number from id json
    const store_id = id.replace(/\D/g, ''); // remove non numbers

    const {
      coordinates: [store_longitude, store_latitude],
    } = item.geometry;

    console.log('store_id:', store_id);
    console.log('store_name:', store_name);
    console.log('discount_on:', discount_on);
    console.log('store_latitude:', store_latitude);
    console.log('store_longitude:', store_longitude);

    dbConnection.query(insertQuery1,[store_id, store_name, discount_on, store_latitude, store_longitude],(error, results) => {
        if (error) {
          console.error('Error updating database:', error);
          res.status(500).json({ error: 'Database update failed' });
          return;
        }
        res.json({ message: 'Database updated successfully' });
      });
    }
  });

//------ end of update database -----------//


app.listen(3000, () => console.log("Server is Running..."));
