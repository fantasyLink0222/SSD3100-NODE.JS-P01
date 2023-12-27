"use strict";

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3007;
const passport = require("passport");
const LocalStrategy = require("passport-local");
require("dotenv").config();



//set up for the searchbar
const profileController = require("./controllers/ProfileController");
const productController = require("./controllers/ProductController");
const invoiceController = require("./controllers/InvoiceController");

//declaring mongoose
const mongoose = require("mongoose");

//mongoose connection string

 //"mongodb+srv://test_user01:KbBFpMsInfrkpdKW@ss3100-p01.hjj7rm1.mongodb.net/?retryWrites=true&w=majority"
 const uri = "mongodb+srv://test_user01:KbBFpMsInfrkpdKW@ss3100-p01.hjj7rm1.mongodb.net/?retryWrites=true&w=majority";
//load indexRouter
const indexRouter = require("./routers/indexRouter");
const productsRouter = require("./routers/productsRouter");
const profilesRouter = require("./routers/profilesRouter");
const invoicesRouter = require("./routers/invoicesRouter");

// set up default mongoose connection
mongoose.connect(uri);

// store a reference to the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//tell express where to find templates(views)
app.set("views", path.join(__dirname, "views"));
//set view engine to ejs
app.set("view engine", "ejs");



//import express ejs layouts
const expressLayouts = require("express-ejs-layouts");
//use ejs layout
app.use(expressLayouts);
//set default layout
app.set("layout", "layouts/full-width");
app.get('/invoiceDetails', (req, res) => {
  res.render('invoiceDetails', { layout: false });
});

//morgan logging middleware
const logger = require("morgan");
//use logger as middleware
app.use(logger("dev"));

//parse applicaion form-urlencoded
const bodyParser = require("body-parser");
const { profile } = require("console");
const Profile = require("./models/Product");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Set up session management
app.use(
  require("express-session")({
    secret:"a longe time ago",
    resave: false,
    saveUninitialized: false,
  })
)

//express static middleware : making the public folder globally accessible
app.use(express.static("public"));

// Profile search route
app.get("/profiles/search", profileController.searchProfiles);

// Product search route
app.get("/products/search", productController.searchProducts);

// Invoice search route
app.get("/invoices/search", invoiceController.searchInvoices);

//routes
app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/profiles", profilesRouter);
app.use("/invoices", invoicesRouter);

//catch any unmatched routes
app.all("/*", (req, res) => {
  res.status(404).send("File not found.");
});

//start listening to port
app.listen(port, () => console.log(`app listening on port ${port}!`));

// Initialize passport and configure for User model
app.use(passport.initialize());
app.use(passport.session());
const User = require("./models/User");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
