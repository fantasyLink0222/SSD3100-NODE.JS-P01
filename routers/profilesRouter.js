const ProfileController = require("../controllers/ProfileController");

const fs = require("fs").promises;
const path = require("path");

const express = require("express");
const profilesRouter = express.Router();

// construct the path to our data folder
const dataPath = path.join(__dirname, "../data/");

profilesRouter.get("/", ProfileController.Index);

// note that the create route need to come before the detail routes or else it will be interpreted as a detail route
profilesRouter.get("/create", ProfileController.Create);
profilesRouter.post("/create", ProfileController.CreateProfile);

profilesRouter.get("/:id", ProfileController.Detail);
profilesRouter.get("/edit/:id", ProfileController.Edit);
profilesRouter.post("/edit/:id", ProfileController.EditProfile);
profilesRouter.get("/:id/delete", ProfileController.DeleteProfileById);
// profilesRouter.get("/search", ProfileController.SearchProducts);


module.exports = profilesRouter;
