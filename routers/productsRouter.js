const express = require("express");
const productsRouter = express.Router();
const productController = require("../controllers/ProductController");
const secureController = require("../controllers/SecureController");
 
// Apply the Admin middleware to routes that require admin privileges
productsRouter.get("/create", secureController.Admin, productController.Create);
productsRouter.post("/create", secureController.Admin, productController.CreateProduct);

productsRouter.get("/edit/:id", secureController.Admin, productController.Edit);
productsRouter.post("/edit/:id", secureController.Admin, productController.EditProduct);


productsRouter.get("/", secureController.Admin,productController.Products);
productsRouter.get("/:id",secureController.Admin, productController.ProductDetail);

productsRouter.get("/:id/delete", secureController.Admin, productController.DeleteProductById);

 


module.exports = productsRouter;