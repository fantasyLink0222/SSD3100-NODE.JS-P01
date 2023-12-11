const InvoiceController = require("../controllers/InvoiceController");

const fs = require("fs").promises;
const path = require("path");

const express = require("express");
const invoicesRouter = express.Router();

// construct the path to our data folder
const dataPath = path.join(__dirname, "../data/");

invoicesRouter.get("/", InvoiceController.Index);

// note that the create route need to come before the detail routes or else it will be interpreted as a detail route
invoicesRouter.get("/create", InvoiceController.Create);
invoicesRouter.post("/create", InvoiceController.CreateInvoice);

invoicesRouter.get("/:id", InvoiceController.Detail);
//invoicesRouter.get("/delete/:id", InvoiceController.DeleteInvoiceById);
// invoicesRouter.get("/search", InvoiceController.SearchProducts);


module.exports = invoicesRouter;
