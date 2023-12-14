const Invoice = require("../models/Invoice");
const InvoiceOps = require("../data/InvoiceOps");
const Product = require("../models/Product.js");
const Profile = require("../models/Profile.js");
const ProfileOps = require("../data/ProfileOps");
const ProductOps = require("../data/ProductOps.js");
const _profileOps = new ProfileOps();
const _invoiceOps = new InvoiceOps();
const _productOps = new ProductOps();

exports.searchInvoices = async function(req, res) {
  const searchQuery = req.query.q;

  try {
    const invoices = await _invoiceOps.find({
      $or: [
        { invoiceNumber: { $regex: searchQuery, $options: "i" } },
        { "profile.name": { $regex: searchQuery, $options: "i" } },
        { "profile.company": { $regex: searchQuery, $options: "i" } },
        { "products.name": { $regex: searchQuery, $options: "i" } }
        // Add more fields here if needed
      ]
    
    });

    res.render("invoices", { invoices: invoices, layout: "layouts/full-width" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.Index = async function (request, response) {
  console.log("loading invoices from controller");
  let invoices = await _invoiceOps.getAllInvoices();
  if (invoices) {
    response.render("invoices", {
      title: "Billing - Invoices",
      invoices: invoices,
      layout: "layouts/full-width",
      errorMessage: "",
    });
  } else {
    response.render("invoices", {
      title: "Billing - Invoices",
      invoices: [],
      errorMessage: "",
      layout: "layouts/full-width"
    });
  }
};

exports.Detail = async function (request, response) {
  const invoiceId = request.params.id;
  console.log(`loading single invoice by id ${invoiceId}`);
  let invoice = await _invoiceOps.getInvoiceById(invoiceId);
  let invoices = await _invoiceOps.getAllInvoices();

  if (invoice) {
    response.render("invoiceDetail", {
      title: "Express Yourself - " + invoice._id,
      invoices: invoices,
      invoiceId: request.params.id,
      invoice: invoice,
      layout: false ,
      applySpecialCSS: true 
    });
  } else {
    response.render("invoices", {
      title: "Billing - Invoices",
      invoices: [],
    
    });
  }
};

// Handle invoice form GET request
exports.Create = async function (request, response) {
  let profiles = await _profileOps.getAllProfiles();
  let products = await _productOps.getAllProducts();
  response.render("invoice-form", {
    title: "Create Invoice",
    errorMessage: "",
    invoice: {},
    profiles:profiles,
    products:products,
    layout: "layouts/full-width"
  });
};

// Handle invoice form GET request
exports.CreateInvoice = async function (request, response) {
  let profiles = await _profileOps.getAllProfiles();
  //let products = await _productOps.getAllProducts();
  console.log("rb", request.body);
  //let productQTY = request.body.productQuantities;
  let profileId = request.body.selectedProfile;

  let profileObj = await _profileOps.getProfileById(profileId);



  let productIds =request.body['purchasedProduct[]'];
  let quantities = request.body['quantity[]'];

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
    invoiceNumber: request.body.invoiceNumber,
    issueDate: request.body.issueDate,
    dueDate: request.body.dueDate,
    profile: profileObj,
    products: productobjs,
    totalDue:productTotalAmt,
  });

let responseObj = await _invoiceOps.createInvoice(tempInvoiceObj);

  // if no errors, save was successful
  if (responseObj.errorMsg == "") {
    let invoices = await _invoiceOps.getAllInvoices();
    console.log(responseObj.obj);
    response.render("invoices", {
      title: "Express bill - " + responseObj.obj.invoiceNumber,
      
      invoices: invoices,
      profiles:profiles,
      products: productobjs,
      invoiceId: responseObj.obj._id.valueOf(),
      layout: "layouts/full-width",
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    console.log("An error occured. Item not created.");
    response.render("invoice-form", {
      title: "Create invoice",
      invoice: responseObj.obj,
      profiles:profiles,
      products: productobjs,
      errorMessage: responseObj.errorMsg,
    });
  }
};

// Handle invoice form GET request
exports.DeleteInvoice = async function (request, response) {
  const invoiceId = request.params.id;
  console.log(`deleting single invoice by id ${invoiceId}`);
  let deletedInvoice = await _invoiceOps.deleteInvoiceById(invoiceId);
  let invoices = await _invoiceOps.getAllInvoices();

  if (deletedInvoice) {
    response.render("invoices", {
      title: "Billing - invoices",
      invoices: invoices,
      errorMessage: "",
      layout: "layouts/full-width"
    });
  } else {
    response.render("invoices", {
      title: "Billing - invoices",
      invoices: invoices,
      errorMessage: "Error.  Unable to Delete",
      layout: "layouts/full-width"
    });
  }
};
