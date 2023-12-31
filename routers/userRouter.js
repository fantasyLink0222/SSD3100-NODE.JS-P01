const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/UserController");


// GET register page
userRouter.get("/register", UserController.Register);
// Handle register form submission
userRouter.post("/register", UserController.RegisterUser);

// GET login page
userRouter.get("/login", UserController.Login);
// Handle login form submission
userRouter.post("/login", UserController.LoginUser);

// GET logout
userRouter.get("/logout", UserController.Logout);

// GET profile page
userRouter.get("/userProfile", UserController.UserProfile);

module.exports = userRouter;
