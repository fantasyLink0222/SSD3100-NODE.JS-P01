const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../services/RequestService");
const Invoice = require("../models/Invoice");
const InvoiceOps = require("../data/InvoiceOps");
const UserOps = require("../data/UserOps.js");

const UserData = require("../data/UserData");
const _userData = new UserData();
const _invoiceOps = new InvoiceOps();
const _userOps = new UserOps();

// Displays registration form.
exports.Register = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  res.render("user/register", { errorMessage: "", user: {}, reqInfo: reqInfo });
};
// Handles 'POST' with registration form submission.
exports.RegisterUser = async function (req, res) {
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  if (password == passwordConfirm) {
    // Creates user object with mongoose model.
    // Note that the password is not present.
    const newUser = new User({
      companyName: req.body.companyName,
      companyCode: req.body.companyCode,
      email: req.body.email,
      username: req.body.username,
      roles:"RegUser"
    });
    // Uses passport to register the user.
    // Pass in user object without password
    // and password as next parameter.
    User.register(
      new User(newUser),
      req.body.password,
      function (err, account) {
        // Show registration form with errors if fail.
        if (err) {
          let reqInfo = RequestService.reqHelper(req);
          return res.render("user/register", {
            user: newUser,
            errorMessage: err,
            reqInfo: reqInfo,
          });
        }
        // User registration was successful, so let's immediately authenticate and redirect to home page.
        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      }
    );
  } else {
    let reqInfo = RequestService.reqHelper(req);
    res.render("user/register", {
      user: {
        companyName: req.body.companyName,
        companyCode: req.body.companyCode,
        email: req.body.email,
        username: req.body.username,
      },
      errorMessage: "Passwords do not match.",
      reqInfo: reqInfo,
    });
  }
};

// Show login form.
exports.Login = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  let errorMessage = req.query.errorMessage;
  res.render("user/login", {
    user: {},
    errorMessage: errorMessage,
    reqInfo: reqInfo,
  });
};
// Receive login information, authenticate, and redirect depending on pass or fail.
exports.LoginUser = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/user/userProfile",
    failureRedirect: "/user/login?errorMessage=Invalid login.",
  })(req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
  // Use Passports logout function
  req.logout((err) => {
    if (err) {
      console.log("logout error");
      return next(err);
    } else {
      // logged out. Update the reqInfo and redirect to the login page
      let reqInfo = RequestService.reqHelper(req);
      res.render("user/login", {
        user: {},
        isLoggedIn: false,
        errorMessage: "",
        reqInfo: reqInfo,
      });
    }
  });
};

exports.UserProfile = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  console.log("loading my profile");
  if (reqInfo.authenticated) {
    let roles = await _userData.getRolesByUsername(reqInfo.username);
    
    let sessionData = req.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    let userInfo = await _userData.getUserByUsername(reqInfo.username);
    
  
    return res.render("user/userProfile", {
      reqInfo: reqInfo,
      userInfo: userInfo,
      
    });
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be logged in to view this page."
    );
  }
};

exports.UserProfileEdit= async function (req, res) {

  console.log("editing user profile");
  
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated ) {
    let roles = await _userData.getRolesByUsername(reqInfo.username);
    let sessionData = req.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    let userInfo = await _userData.getUserByUsername(reqInfo.username);

    console.log("userId", userInfo.user._id);
    return res.render("user/userProfileEdit", {
      reqInfo: reqInfo,
      userInfo: userInfo,
      
    });
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be logged in to view this page."
    );
  }
};

exports.UserProfileEditUser= async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  if (!reqInfo.authenticated) {
    return res.redirect("/user/login?errorMessage=You must be logged in to view this page.");
  }
  
  let userInfo = await _userData.getUserByUsername(reqInfo.username);
  const userId = userInfo.user._id;
  
  if (req.body) {
    let resObj = await _userData.updateUserProfileById(userId, req.body);
    if (resObj.errorMsg != "") {
      return res.redirect("/user/login?errorMessage=You must be logged in to view this page.")
    }
  }
  
  
  let updatedUserInfo = await _userData.getUserByUserId(userId);
  return res.render("user/userProfile", {
    reqInfo: reqInfo,
    userInfo: updatedUserInfo,
  });
};




exports.UserInvoiceList = async function (req, res) {
  console.log("loading invoices list ");
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    try {
      let roles = await _userData.getRolesByUsername(reqInfo.username);
      let sessionData = req.session;
      sessionData.roles = roles;
      reqInfo.roles = roles;
      let userInfo = await _userData.getUserByUsername(reqInfo.username);
      console.log("Fetched userInfo:", userInfo); // Check what userInfo contains
      
      if (!userInfo) {
        console.error("No user found for username:", reqInfo.username);
        // Handle case where user is not found
        return res.status(404).send("User not found");
      }
      let currentUsername = userInfo.user.username;
     
      // Await the promise from Invoice.find()
      const userInvoices = await Invoice.find({ "user.username": currentUsername });
      if (!userInvoices) {
        console.error("No userInvoice found for username:", userInvoices);
        // Handle case where user is not found
        return res.status(404).send("Userinvoice not found");
      }
     
      return res.render("user/userInvoices", {
        reqInfo: reqInfo,
        userInfo: userInfo,
        userInvoices: userInvoices,
      });
    } catch (error) {
      // Log and handle the error
      console.error("Error fetching user invoices: ", error);
      res.status(500).send("An error occurred while fetching user invoices");
    }
  } else {
    res.redirect("/user/login?errorMessage=You must be logged in to view this page.");
  }
};