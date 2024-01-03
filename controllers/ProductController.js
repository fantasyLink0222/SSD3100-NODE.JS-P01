const ProductOps = require("../data/ProductOps");
const _productOps = new ProductOps();
const Product = require("../models/Product.js");
const RequestService = require("../services/RequestService");

exports.searchProducts = async function (req, res) {
  console.log("searching for products");
  const searchQuery = req.query.q;

  try {
    const products = await _productOps.find({
      productName: { $regex: searchQuery, $options: "i" },
    });

    res.render("products", {
      products: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.Products = async function (req, res) {

  //let reqInfo = RequestService.reqHelper(req, ["Admin"]);
  console.log("loading products from controller");
  let products = await _productOps.getAllProducts();

  if (products ) {
    res.render("products", {
      //reqInfo: reqInfo ,
      title: "Express Billing - Products",
      products: products,
      layout: "layouts/full-width",
    });
  } else {
    res.render("products", {
      title: "Express Billing - Products",
      products: [],
    });
  }
};

exports.ProductDetail = async function (req, res) {
  const productId = req.params.id;
  //let reqInfo = RequestService.reqHelper(req, ["Admin"]);
  console.log(`loading single product by id ${productId}`);
  let product = await _productOps.getProductById(productId);
  let products = await _productOps.getAllProducts();
  if (product) {
    res.render("productDetails", {
      title: "Express Yourself - " + product.productName,
      
      products: products,
      productId: req.params.id,
      layout: "./layouts/full-width",
    });
  } else {
    res.render("productsDetails", {
      title: "Express Yourself - Products",
      products: [],
    });
  }
};

exports.Create = async function (req, res) {
  res.render("product-create", {
    title: "Create Product",
    errorMessage: "",
    product_id: null,
    product: {},
  });
};

exports.CreateProduct = async function (req, res) {
  
  let tempProductObj = new Product({
    productName: req.body.productName,
    unitCost: req.body.unitCost,
    productCode: req.body.productCode,
  });

  let responseObj = await _productOps.createProduct(tempProductObj);

  if (responseObj.errorMsg == "") {
    let products = await _productOps.getAllProducts();
    console.log(responseObj.obj);
    res.render("products", {
      title: "Products",
      products: products,
      product_id: responseObj.obj._id.valueOf(),
      //this is where we can set the layout
    });
  } else {
    console.log("An error occured. Product was not created.");
    res.render("product-create", {
      title: "Create product",
      product: responseObj.obj,
      errorMessage: responseObj.errorMsg,
    });
  }
};

exports.Edit = async function (request, response) {
  const productId = request.params.id;
  let productObj = await _productOps.getProductById(productId);
  response.render("product-edit", {
    title: "Edit Profile",
    errorMessage: "",
    product_id: productId,
    product: productObj,
  });
};

exports.EditProduct = async function (request, response) {
  const productId = request.body.product_id;
  const productObj = {
    productName: request.body.productName,
    unitPrice: request.body.unitCost,
    productCode: request.body.productCode,
  };

  console.log(`This is the product id${productId}`);

  let responseObj = await _productOps.updateProductById(productId, productObj);

  if (responseObj.errorMsg == "") {
    let products = await _productOps.getAllProducts();
    response.render("productDetails", {
      title: "Products",
      products: products,
      productId:productId,

      //insert layout to be used
    });
  } else {
    console.log("An error occured. Item was not updated.");
    response.render("product-edit", {
      title: "Edit Product",
      product: responseObj.obj,
      product_id: productId,
      errorMessage: responseObj.errorMsg,
    });
  }
};

exports.DeleteProductById = async function (request, response) {
  const productId = request.params.id;
  console.log(`deleting a single product by id ${productId}`);
  let deletedProduct = await _productOps.deleteProduct(productId);
  let products = await _productOps.getAllProducts();

  if (deletedProduct) {
    response.render("products", {
      title: "Products",
      products: products,
    });
  } else {
    response.render("products", {
      title: "Products",
      products: products,
      errorMessage: "Error. Could not delete product.",
    });
  }
};
//Im not sure if we need this function
exports.deleteProduct = async function (req, res) {
  const productId = req.params.id;
  try {
    const deletedProduct = await ProductOps.deleteProduct(productId);
    if (!deletedProduct) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json(deletedProduct);
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
};
