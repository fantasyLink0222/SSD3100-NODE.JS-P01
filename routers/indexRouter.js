const express = require("express");
const indexRouter = express.Router();

//home page route
indexRouter.get("/", async (req, res) => {
    res.render("home", {title: "Home"});
});

// indexRouter.get("/invoices", async(req, res) => {
//     res.render("invoices", {title: "Invoices"});
// })


module.exports = indexRouter;