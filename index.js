const path = require('path');

const express = require('express');

const baseRoutes = require('./routes/base-routes');
const adminRoutes = require("./routes/admin-routes");




const db = require('./data/database');

const app = express();

// Activate EJS view engine, and tell it to use the ejs files in the views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//allows us to handle data attached to requests, like form data etc
app.use(express.urlencoded({ extended: false }));
//For extracting json data from some requests
app.use(express.json());
app.use(express.static('public')); // Serve static files (e.g. CSS files)
app.use("/products/assets", express.static("product-data"));


//use the routes defined in routes.js
app.use(baseRoutes);
app.use("/admin", adminRoutes);



// app.use(function (error, req, res, next) {
//   // Default error handling function
//   // Will become active whenever any route / middleware crashes
//   console.log(error);
//   res.status(500).render('500');
// });

//connect to our database, THEN start listing (i.e launch app if successful)
db.connectToDatabase().then(function () {
  app.listen(3000);
});
