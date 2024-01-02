const InvoiceController = require("../controllers/InvoiceController");
const secureController = require("../controllers/SecureController");

const fs = require("fs").promises;
const path = require("path");

const express = require("express");
const invoicesRouter = express.Router();

// construct the path to our data folder
const dataPath = path.join(__dirname, "../data/");

invoicesRouter.get("/", secureController.Manager,InvoiceController.Index);

// note that the create route need to come before the detail routes or else it will be interpreted as a detail route
invoicesRouter.get("/create", secureController.Manager,InvoiceController.Create);
invoicesRouter.post("/create",secureController.Manager, InvoiceController.CreateInvoice);

invoicesRouter.get("/:id", secureController.Manager,InvoiceController.Detail);
invoicesRouter.get("/:id/delete", secureController.Manager,InvoiceController.DeleteInvoice);

invoicesRouter.get("/:id/MarkAsPaid", secureController.Manager,InvoiceController.MarkInvoice);
invoicesRouter.post("/:id/MarkAsPaid", secureController.Manager,InvoiceController.MarkInvoiceAsPaid);

//invoicesRouter.get("/delete/:id", InvoiceController.DeleteInvoiceById);
// invoicesRouter.get("/search", InvoiceController.SearchProducts);


module.exports = invoicesRouter;
