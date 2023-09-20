const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const dbConnection = require('./database');
const { body, validationResult } = require('express-validator');
const { name } = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { error, Console } = require('console');




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
//<<<<<<< Updated upstream


app.get('/charts', ifNotLoggedin, (req, res, next) => {
  dbConnection.execute("SELECT name, password FROM users WHERE id=?", [req.session.userID])
    .then(([rows]) => {
      res.render('charts', { name: rows[0].name});
    });
});


app.get('/upload', ifNotLoggedin, (req, res, next) => {
  dbConnection.execute("SELECT name, password FROM users WHERE id=?", [req.session.userID])
    .then(([rows]) => {
      res.render('upload', { name: rows[0].name});
    });
});

app.get('/leaderboard', ifNotLoggedin, (req, res, next) => {
  dbConnection.execute("SELECT name, password FROM users WHERE id=?", [req.session.userID])
    .then(([rows]) => {
      res.render('leaderboard', { name: rows[0].name });
    });
});

//=======




//>>>>>>> Stashed changes











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
          req.session.name = rows[0].name; // Set the user's name in the session
          req.session.password = rows[0].password; // Set the user's password in the session
          res.redirect('/');
        } else {
          res.render('login-register', { login_errors: ['Invalid Password!'] });
        }
      }).catch(err => {
        // Handle database query errors
        if (err) throw err;
      });
  } else {
    let allErrors = validation_result.errors.map((error) => {
      return error.msg;
    });

    // RENDER login-register PAGE WITH LOGIN VALIDATION ERRORS
    res.render('login-register', { login_errors: allErrors });
  }
}); // END OF LOGIN PAGE








/// ALLAGH PASSWORD KAI USERNAME

/// ALLAGH PASSWORD KAI USERNAME


app.post('/changepassword', [
    body('newname', 'Username is Empty!').trim().not().isEmpty(),
    body('newpassword', 'The password must be of minimum length 8 characters').trim().isLength({ min: 8 }),
    body('newpassword', 'The password must contain at least one uppercase letter').trim().not().isLowercase(),
    body('newpassword', 'The password must contain at least one number').trim().matches(/\d/),
    body('newpassword', 'The password must contain at least one special character').matches(/[!@#$%^&*(),.?":{}|<>]/),
], (req, res, next) => {
    const validation_result = validationResult(req);
    const { newname, newpassword } = req.body;
    const userID = req.session.userID;

    if (validation_result.isEmpty()) {
        // Validation passed, update the user's information in the database
        const sql = "UPDATE users SET name = ?, password = ? WHERE id = ?";

        dbConnection.execute(sql, [newname, newpassword, userID])
            .then((result) => {
                // The update was successful
                console.log('User information updated successfully');
                // Update the session data with the new name and password
                req.session.name = newname;
                req.session.password = newpassword;
                // Send a response to the client to refresh the page
                res.redirect('/profile');
            })
            .catch((err) => {
                // Handle database query errors
                console.log('Database error:', err);
                if (err) throw err;
                // You can send an error response to the client if needed
            });
    } else {
        // Validation failed, collect validation errors
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });

        // RENDER profile PAGE WITH VALIDATION ERRORS
        res.render('profile', {
            validation_errors: allErrors,
            name: req.session.name,
            password: req.session.password,
            // Pass the password validation errors to the template
            password_validation_errors: allErrors.filter(error => error.startsWith('The password'))
        });
    }
});







// ...
// ...


// ...


























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


    const [results, fields] = await dbConnection.execute('SELECT  COALESCE(stores.store_name, "Unknown") AS store_name, stores.store_latitude,  stores.store_longitude, stores.discount_on, stores.store_id ,  COALESCE(discount.product_id, "Unknown") AS product_id, COALESCE(discount.price, "Unknown") AS price, COALESCE(discount.date_entered, "Unknown") AS date_entered,  COALESCE(discount.stock, "Unknown") AS stock,  discount_id AS discount_id,  COALESCE(products.name, "Unknown") AS product_name,  COALESCE(category.name, "Unknown") AS category_name,  COALESCE(users.name, "Unknown") AS user_name, COALESCE(users.id, "Unknown") AS user_id FROM stores LEFT JOIN discount ON stores.store_id = discount.store_id LEFT JOIN products ON discount.product_id = products.product_id LEFT JOIN category ON products.category_id = category.category_id LEFT JOIN users ON discount.user_id = users.id;');
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

//---------------chart 1--------

app.get("/admin/chart1", async (req, res)=> {

  const [results, fields] = await dbConnection.execute('SELECT DATE_FORMAT(date_entered, "%Y-%m-%d") AS date_only, COUNT(*) AS discount_count  FROM discount GROUP BY DATE_FORMAT(date_entered, "%Y-%m-%d")  ORDER BY DATE_FORMAT(date_entered, "%Y-%m-%d");');
 //console.log("Query returned ${results.length} results:");

  res.send(results);

});

//------------------ likes



app.get("/profile/button/like", async (req, res) => {

    const [results, fields] = await dbConnection.execute(
      'SELECT like_id, discount_id FROM `like` WHERE user_id = ?',
      [req.session.userID]
    );

    res.send(results);

});


//--------------------- dislike

app.get("/profile/button/dislike", async (req, res) => {

  const [results, fields] = await dbConnection.execute(
    'SELECT dislike_id, discount_id FROM `dislike` WHERE user_id = ?',
    [req.session.userID]
  );

  res.send(results);

});

//----------------- discount history
app.get("/profile/button/discountHisory", async (req, res) => {

  const [results, fields] = await dbConnection.execute(
    'SELECT discount_id, price, DATE_FORMAT(date_entered, "%Y-%m-%d") AS date_entered FROM `discount` WHERE user_id = ?',
    [req.session.userID]
  );

  res.send(results);

});






//--------------- Total Score------------
app.get("/profile/total/score", async (req, res) => {

  const [results, fields] = await dbConnection.execute(
    'SELECT points FROM score WHERE user_id = ?',
    [req.session.userID]
  );

  res.send(results);

});

//--------- monthly score
app.get("/profile/month/score", async (req, res) => {

  const [results, fields] = await dbConnection.execute(
    'SELECT points FROM monthly_score WHERE user_id = ?',
    [req.session.userID]
  );

  res.send(results);

});







//------------ add 5 points for like-----------

app.post('/add/score', (req, res) => {
  const { user_id } = req.body;

  const sql = `
    INSERT INTO score (user_id, date, points)
    VALUES (?, CURRENT_TIMESTAMP, 5)
  `;

  dbConnection.query(sql, [user_id], (error, results) => {
    if (error) {
      console.error('Error inserting data into the database:', error);
      res.status(500).json({ error: 'An error occurred while updating data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});
//-----------------admin delete discount
app.post('/admin/delete/discount', (req, res) => {
  const { discount_id } = req.body;

  const sql = `
    DELETE FROM discount WHERE discount_id = ?
  `;

  const sql2 = `
    DELETE FROM 'like' WHERE discount_id = ?
  `;

  const sql3 = `
  DELETE FROM dislike WHERE discount_id = ? =?
`;

dbConnection.query(sql, [discount_id], (err1, results1) => {


  // Execute the second SQL query
  dbConnection.query(sql2, [discount_id], (err2, results2) => {


    // Execute the third SQL query
    dbConnection.query(sql3, [discount_id], (err3, results3) => {



    });
  });
});
});

//---------------- -1 points fro dislike----------------
app.post('/min/score', (req, res) => {
  const { user_id } = req.body;

  const sql = `
    INSERT INTO score (user_id, date, points)
    VALUES (?, CURRENT_TIMESTAMP, -1)
  `;

  dbConnection.query(sql, [user_id], (error, results) => {
    if (error) {
      console.error('Error inserting data into the database:', error);
      res.status(500).json({ error: 'An error occurred while updating data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

// --------------- upload score-------------

app.get("/final/score", async (req, res)=> {
//<<<<<<< Updated upstream

  const [results, fields] = await dbConnection.execute('SELECT score.score_id, score.user_id, score.points, users.name FROM score INNER JOIN users ON score.user_id = users.id;  ');
//=======

 // const [results, fields] = await dbConnection.execute('SELECT score_id, user_id, points FROM score ');
//>>>>>>> Stashed changes
 //console.log("Query returned ${results.length} results:");

  res.send(results);

});




//-------- store likes

app.post('/update/like', (req, res) => {
  const { discount_id  } = req.body;

  const sql = `
  INSERT INTO \`like\` (user_id, discount_id)
  VALUES (?, ?)
  ON DUPLICATE KEY UPDATE user_id=user_id, discount_id =discount_id
`;


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
//------------------------ dislike----------------
app.post('/update/dislike', (req, res) => {
  const { discount_id  } = req.body;

  const sql = `
  INSERT INTO dislike (user_id, discount_id)
  VALUES (?, ?)
  ON DUPLICATE KEY UPDATE user_id=user_id, discount_id =discount_id
`;


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
//------------------ out of stock-----

 app.post('/out/of/stock', (req, res) => {
  const { discount_id } = req.body;

  const sql = `
    UPDATE discount
    SET stock = 0
    WHERE discount_id = ?;
  `;

  dbConnection.query(sql, [discount_id], (error, results) => {
    if (error) {
      console.error('Error updating data in the database:', error);
      res.status(500).json({ error: 'An error occurred while updating data' });
    } else {
      if (results.affectedRows === 0) {
        // If no rows were affected, the discount_id doesn't exist in the table.
        res.status(404).json({ error: 'Discount not found' });
      } else {
        console.log('Data updated successfully');
        res.status(200).json({ message: 'Data updated successfully' });
      }
    }
  });
});






//----------------------in stock-------------
app.post('/in/stock', (req, res) => {
  const { discount_id } = req.body;

  const sql = `
    UPDATE discount
    SET stock = 1
    WHERE discount_id = ?;
  `;

  dbConnection.query(sql, [discount_id], (error, results) => {
    if (error) {
      console.error('Error updating data in the database:', error);
      res.status(500).json({ error: 'An error occurred while updating data' });
    } else {
      if (results.affectedRows === 0) {
        // If no rows were affected, the discount_id doesn't exist in the table.
        res.status(404).json({ error: 'Discount not found' });
      } else {
        console.log('Data updated successfully');
        res.status(200).json({ message: 'Data updated successfully' });
      }
    }
  });
});

//---------------------- upload dislike---------
app.get("/dislike/counter", async (req, res)=> {

  const [results, fields] = await dbConnection.execute('SELECT user_id, discount_id FROM dislike  ;');
 //console.log("Query returned ${results.length} results:");
  console.log(results);
  res.send(results);

});

//----------------------- upload stock--- dexn xreazete
app.get("/update/stock", async (req, res)=> {

  const [results, fields] = await dbConnection.execute('SELECT stock, discount_id FROM discount ;');
 //console.log("Query returned ${results.length} results:");
  console.log(results);
  res.send(results);

});


//----------- upload likes
app.get("/like/counter", async (req, res)=> {

  const [results, fields] = await dbConnection.execute('SELECT user_id, discount_id FROM \`like\`  ;');
 //console.log("Query returned ${results.length} results:");
  console.log(results);
  res.send(results);

});


//-------- save discount


app.post('/updateData', (req, res) => {
  const { product_id, store_id, enteredPrice } = req.body;


  // Create an SQL query to insert the data into the database
  const sql = 'INSERT INTO discount (user_id, product_id, store_id, price, date_entered, stock) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 1)';

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

//---------------------- upload prices in order to compare



app.get("/prices/for/compare", async (req, res)=> {

  const [results, fields] = await dbConnection.execute('SELECT price_avg AS latest_price, price5 AS newest_price, product_id FROM prices ;');
 //console.log("Query returned ${results.length} results:");

  res.send(results);

});



//-------------- give 50 points after the add discount
app.post('/add/score/50', (req, res) => {
  const { points } = req.body;


  // Create an SQL query to insert the data into the database
const sql = `
  INSERT INTO score (user_id, date, points)
  VALUES (?, CURRENT_TIMESTAMP, ?)
`;

  // Execute the SQL query
  dbConnection.query(sql, [req.session.userID, points], (error, results) => {
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

  for (const item of jsonData.data) {
    const { id: product_id, prices } = item;

    const priceValues = prices.map(price => price.price);
    const priceAvg = priceValues.reduce((total, price) => total + price, 0) / priceValues.length;

    const dateValues = prices.map(priceData => new Date(priceData.date));
    const newest_date = new Date(Math.min(...dateValues));
    const latest_date = new Date(Math.max(...dateValues));

    const insertQuery = `
      INSERT INTO prices (product_id, newest_date, latest_date, price1, price2, price3, price4, price5, price_avg)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        newest_date = VALUES(newest_date),
        latest_date = VALUES(latest_date),
        price1 = VALUES(price1),
        price2 = VALUES(price2),
        price3 = VALUES(price3),
        price4 = VALUES(price4),
        price5 = VALUES(price5),
        price_avg = VALUES(price_avg)
    `;

    dbConnection.query(
      insertQuery,
      [product_id, newest_date, latest_date, ...priceValues, priceAvg],
      (error, results) => {
        if (error) {
          console.error('Error updating database:', error);
          res.status(500).json({ error: 'Database update failed' });
          return;
        }
      }
    );
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


app.post('/update-database2', (req, res) => {
  const jsonData2 = req.body;
  const products = jsonData2.products;
console.log(jsonData2)

  // Loop through the products and insert them into the database
  products.forEach((product) => {
    const sql = `INSERT INTO products (product_id, name, category_id, subcategory_id) VALUES (?, ?, ?, ?)`;
    const values = [product.id, product.name, product.category, product.subcategory];

    dbConnection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting product:', err);
      } else {
        console.log('Product inserted:', result);
      }
    });
  });

  res.send('Data inserted into the database');
});

app.post('/delete_from_Prices', (req, res) => {
  console.log("aaa")
  const sql='DELETE  FROM prices';
  dbConnection.query(sql);
 
  });

  app.post('/delete_from_Stores', (req, res) => {
    console.log("aaa")
    const sql='DELETE  FROM stores';
    dbConnection.query(sql);
   
    });

    app.post('/delete_from_Products', (req, res) => {
      console.log("aaa")
      const sql='DELETE  FROM products';
      dbConnection.query(sql);
     
      });
  
app.listen(3000, () => console.log("Server is Running..."));
