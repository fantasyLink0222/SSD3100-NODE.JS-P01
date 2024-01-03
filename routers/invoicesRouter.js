const invoiceController = require("../controllers/InvoiceController");
const secureController = require("../controllers/SecureController");

const fs = require("fs").promises;
const path = require("path");

const express = require("express");
const invoicesRouter = express.Router();

// construct the path to our data folder
const dataPath = path.join(__dirname, "../data/");

invoicesRouter.get("/", secureController.Manager,invoiceController.Index);

// note that the create route need to come before the detail routes or else it will be interpreted as a detail route
invoicesRouter.get("/create", secureController.Manager,invoiceController.Create);
invoicesRouter.post("/create",secureController.Manager, invoiceController.CreateInvoice);

invoicesRouter.get("/:id", invoiceController.Detail);
invoicesRouter.get("/:id/delete", secureController.Manager,invoiceController.DeleteInvoice);

invoicesRouter.get("/:id/MarkAsPaid", secureController.Manager,invoiceController.MarkInvoice);
invoicesRouter.post("/:id/MarkAsPaid", secureController.Manager,invoiceController.MarkInvoiceAsPaid);

//invoicesRouter.get("/delete/:id", InvoiceController.DeleteInvoiceById);
// invoicesRouter.get("/search", InvoiceController.SearchProducts);


module.exports = invoicesRouter;
