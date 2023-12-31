
const express = require("express");
const userOpsRouter = express.Router();
const userOpsController = require("../controllers/UserOpsController");
const secureController = require("../controllers/SecureController");
const userController = require("../controllers/UserController");

const fs = require("fs").promises;
const path = require("path");



// construct the path to our data folder
const dataPath = path.join(__dirname, "../data/");

userOpsRouter.get("/", secureController.Manager,userOpsController.Index);

// note that the create route need to come before the detail routes or else it will be interpreted as a detail route
userOpsRouter.get("/create", secureController.Manager,userController.Register);
userOpsRouter.post("/create", secureController.Manager,userController.RegisterUser);

userOpsRouter.get("/:id", secureController.Manager,userOpsController.Detail);
userOpsRouter.get("/edit/:id", secureController.Manager,userOpsController.Edit);
userOpsRouter.post("/edit/:id", secureController.Manager,userOpsController.EditUser);
userOpsRouter.get("/:id/delete", secureController.Manager,userOpsController.DeleteUserById);
// userOpsRouter.get("/search", UserController.SearchProducts);


module.exports = userOpsRouter;
