const express = require("express");
const indexRouter = express.Router();
const IndexController = require("../controllers/IndexController");

//home page route
indexRouter.get("/", async (req, res) => {
    res.render("home", {title: "Home"});
});

// indexRouter.get("/invoices", async(req, res) => {
//     res.render("invoices", {title: "Invoices"});
// })

// GET home page
indexRouter.get("/", IndexController.Index);

module.exports = indexRouter;