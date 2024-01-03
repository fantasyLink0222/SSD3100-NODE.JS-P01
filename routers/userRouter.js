const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/UserController");
const userOpsController = require("../controllers/UserOpsController");
const invoiceController = require("../controllers/InvoiceController");
const fs = require("fs").promises;
const path = require("path");
const dataPath = path.join(__dirname, "../data/");

// GET register page
userRouter.get("/register", userController.Register);
// Handle register form submission
userRouter.post("/register", userController.RegisterUser);

// GET login page
userRouter.get("/login", userController.Login);
// Handle login form submission
userRouter.post("/login", userController.LoginUser);

// GET logout
userRouter.get("/logout", userController.Logout);

// GET profile page
userRouter.get("/userProfile", userController.UserProfile);
userRouter.get("/userProfileEdit", userController.UserProfileEdit);
userRouter.post("/userProfileEdit", userController.UserProfileEditUser);
userRouter.get("/userInvoices", userController.UserInvoiceList);

module.exports = userRouter;
