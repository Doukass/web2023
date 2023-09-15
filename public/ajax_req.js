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
  }) 