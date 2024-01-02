const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/UserController");
const userOpsController = require("../controllers/UserOpsController");


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
userRouter.get("/edit/:id", userOpsController.Edit);
userRouter.post("/edit/:id", userOpsController.EditUser);

module.exports = userRouter;
