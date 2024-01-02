const express = require("express");
const productsRouter = express.Router();
const productController = require("../controllers/ProductController");
const secureController = require("../controllers/SecureController");
 
// Apply the Admin middleware to routes that require admin privileges
productsRouter.get("/create", secureController.Admin, productController.Create);
productsRouter.post("/create", secureController.Admin, productController.CreateProduct);

// Apply the Manager middleware to routes that require manager privileges
productsRouter.get("/edit/:id", secureController.Admin, productController.Edit);
productsRouter.post("/edit/:id", secureController.Admin, productController.EditProduct);

// All roles can view products, no middleware applied
productsRouter.get("/", secureController.Admin,productController.Products);
productsRouter.get("/:id",secureController.Admin, productController.ProductDetail);

// Apply the Admin middleware to delete route
productsRouter.get("/:id/delete", secureController.Admin, productController.DeleteProductById);

 


module.exports = productsRouter;