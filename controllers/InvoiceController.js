const Invoice = require("../models/Invoice");
const InvoiceOps = require("../data/InvoiceOps");
const Product = require("../models/Product.js");
const User = require("../models/User.js");
const UserOps = require("../data/UserOps.js");
const ProductOps = require("../data/ProductOps.js");
const _userOps = new UserOps();
const _invoiceOps = new InvoiceOps();
const _productOps = new ProductOps();

exports.searchInvoices = async function(req, res) {
  const searchQuery = req.query.q;

  try {
    const invoices = await _invoiceOps.find({
      $or: [
        { invoiceNumber: { $regex: searchQuery, $options: "i" } },
        { "user.username": { $regex: searchQuery, $options: "i" } },
        { "user.companyName": { $regex: searchQuery, $options: "i" } },
        { "products.name": { $regex: searchQuery, $options: "i" } }
        // Add more fields here if needed
      ]
    
    });

    res.render("invoices", { invoices: invoices, layout: "layouts/full-width" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.Index = async function (req, res) {
  console.log("loading invoices from controller");
  let invoices = await _invoiceOps.getAllInvoices();
  if (invoices) {
    res.render("invoices", {
      title: "Billing - Invoices",
      invoices: invoices,
      layout: "layouts/full-width",
      errorMessage: "",
    });
  } else {
    res.render("invoices", {
      title: "Billing - Invoices",
      invoices: [],
      errorMessage: "",
      layout: "layouts/full-width"
    });
  }
};

exports.Detail = async function (req, res) {
  const invoiceId = req.params.id;
  console.log(`loading single invoice by id ${invoiceId}`);
  let invoice = await _invoiceOps.getInvoiceById(invoiceId);
  let invoices = await _invoiceOps.getAllInvoices();

  if (invoice) {
    res.render("invoiceDetail", {
      title: "Express Yourself - " + invoice._id,
      invoices: invoices,
      invoiceId: req.params.id,
      invoice: invoice,
      layout: false ,
      applySpecialCSS: true 
    });
  } else {
    res.render("invoices", {
      title: "Billing - Invoices",
      invoices: [],
    
    });
  }
};

// Handle invoice form GET req
exports.Create = async function (req, res) {
  let users = await _userOps.getAllUsers();
  let products = await _productOps.getAllProducts();
  res.render("invoice-form", {
    title: "Create Invoice",
    errorMessage: "",
    invoice: {},
    users:users,
    products:products,
    layout: "layouts/full-width"
  });
};

// Handle invoice form GET req
exports.CreateInvoice = async function (req, res) {
  let users = await _userOps.getAllUsers();
 
  console.log("rb", req.body);
 
  let userId = req.body.selectedUser;

  let userObj = await _userOps.getUserById(userId);



  let productIds =req.body['purchasedProduct[]'];
  let quantities = req.body['quantity[]'];

  if (!Array.isArray(productIds)) {
    productIds = [productIds];
   }
   if (!Array.isArray(quantities)) {
    quantities = [quantities];
   } 

  let productobjs=[];
  let productTotalAmt = 0;


  if (productIds && quantities && productIds.length === quantities.length) {
    for (let i = 0; i < productIds.length; i++) {
      let productObj = await _productOps.getProductById(productIds[i]);
      console.log("productObj", productObj);
      
      let newProductObj = { 
        ...productObj.toObject(), 
        QTY: parseInt(quantities[i], 10) // Ensure quantity is an integer
      };
  
      console.log("newProductObj", newProductObj);
      productobjs.push(newProductObj);
    }
  };
  
  if (productobjs.length > 0) {
    for (let i = 0; i < productobjs.length; i++) {
      productTotalAmt += productobjs[i].unitCost * productobjs[i].QTY;
    }
  }
      

  
  // instantiate a new Invoice Object populated with form data
  let tempInvoiceObj = new Invoice({
    invoiceNumber: req.body.invoiceNumber,
    issueDate: req.body.issueDate,
    dueDate: req.body.dueDate,
    user: userObj,
    products: productobjs,
    totalDue:productTotalAmt,
  });

let resObj = await _invoiceOps.createInvoice(tempInvoiceObj);

  // if no errors, save was successful
  if (resObj.errorMsg == "") {
    let invoices = await _invoiceOps.getAllInvoices();
    console.log(resObj.obj);
    res.render("invoices", {
      title: "Express bill - " + resObj.obj.invoiceNumber,
      
      invoices: invoices,
      users:users,
      products: productobjs,
      invoiceId: resObj.obj._id.valueOf(),
      layout: "layouts/full-width",
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    console.log("An error occured. Item not created.");
    res.render("invoice-form", {
      title: "Create invoice",
      invoice: resObj.obj,
      users:users,
      products: productobjs,
      errorMessage: resObj.errorMsg,
    });
  }
};

// Handle invoice form GET req
exports.DeleteInvoice = async function (req, res) {
  const invoiceId = req.params.id;
  console.log(`deleting single invoice by id ${invoiceId}`);
  let deletedInvoice = await _invoiceOps.deleteInvoiceById(invoiceId);
  let invoices = await _invoiceOps.getAllInvoices();

  if (deletedInvoice) {
    res.render("invoices", {
      title: "Billing - invoices",
      invoices: invoices,
      errorMessage: "",
      layout: "layouts/full-width"
    });
  } else {
    res.render("invoices", {
      title: "Billing - invoices",
      invoices: invoices,
      errorMessage: "Error.  Unable to Delete",
      layout: "layouts/full-width"
    });
  }
};


exports.MarkInvoice = async function (req, res) {
  const invoiceId = req.params.id;
  console.log(`marking selected invoice ${invoiceId} as paid`);
  let invoiceObj = await _invoiceOps.getInvoiceById(invoiceId);
  let invoices = await _invoiceOps.getAllInvoices();
  res.render("invoices", {
    title: "Billing - invoices",
    errorMessage: "",
    invoices: invoices,
    invoice: invoiceObj,
  });
};

exports.MarkInvoiceAsPaid = async function (req, res) {
  const invoiceId = req.params.id;
  console.log(`Marking invoice as paid by id ${invoiceId}`);
  try {
    let paidInvoice = await _invoiceOps.markInvoiceAsPaidById(invoiceId);
    let invoices = await _invoiceOps.getAllInvoices();

    if (paidInvoice && paidInvoice.errorMsg === "") {
      res.render("invoices", {
        title: "Billing - invoices",
        invoices: invoices,
        invoice: paidInvoice.obj, // assuming paidInvoice returns an object with the invoice
        errorMessage: "",
        layout: "layouts/full-width"
      });
    } else {
      // If paidInvoice is falsy or contains an error message, handle as error
      res.render("invoices", {
        title: "Billing - invoices",
        invoices: invoices,
        errorMessage: paidInvoice ? paidInvoice.errorMsg : "Error. Unable to mark as paid",
        layout: "layouts/full-width"
      });
    }
  } catch (error) {
    // Handle any exceptions that were thrown during the process
    console.error("An error occurred while marking an invoice as paid: ", error);
    res.render("invoices", {
      title: "Billing - invoices",
      invoices: invoices,
      errorMessage: "An unexpected error occurred.",
      layout: "layouts/full-width"
    });
  }
};
  

