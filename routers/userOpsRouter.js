
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


userOpsRouter.get("/create", secureController.Manager,userOpsController.Create);
userOpsRouter.post("/create", secureController.Manager,userOpsController.CreateUser);

userOpsRouter.get("/:id", secureController.Manager,userOpsController.Detail);
userOpsRouter.get("/edit/:id",secureController.RegUser, userOpsController.Edit);
userOpsRouter.post("/edit/:id",secureController.RegUser, userOpsController.EditUser);
userOpsRouter.get("/:id/delete", secureController.Manager,userOpsController.DeleteUserById);



module.exports = userOpsRouter;
