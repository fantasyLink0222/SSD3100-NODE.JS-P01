const Invoice = require("../models/Invoice.js");
const InvoiceOps = require("../data/InvoiceOps");

const _invoiceOps = new InvoiceOps();

exports.searchInvoices = async function(req, res) {
  const searchQuery = req.query.q;

  try {
    const invoices = await _invoiceOps.find({
      name: { $regex: searchQuery, $options: "i" }
    });

    res.render("invoices", { invoices: invoices, layout: "layouts/full-width" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.Index = async function (request, response) {
  console.log("loading invoices from controller");
  let invoices = await _invoiceOps.getAllInvoice();
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
    response.render("invoiceDetails", {
      title: "Express Yourself - " + invoice._id,
      invoices: invoices,
      invoiceId: request.params.id,
      invoice: invoice,
      layout: "layouts/full-width"
    });
  } else {
    response.render("invoices", {
      title: "Billing - Invoices",
      invoices: [],
      layout: "layouts/full-width"
    });
  }
};

// Handle invoice form GET request
exports.Create = async function (request, response) {
  response.render("invoice-create", {
    title: "Create Invoice",
    errorMessage: "",
    invoice: {},
    layout: "layouts/full-width"
  });
};

// Handle invoice form GET request
exports.CreateInvoice = async function (request, response) {
  // instantiate a new Invoice Object populated with form data
  let tempInvoiceObj = new Invoice({
    // name: request.body.name,
    // code: request.body.code,
    // company: request.body.company,
    // email: request.body.email
  })
};

// Handle invoice form GET request
exports.DeleteInvoiceById = async function (request, response) {
  const invoiceId = request.params.id;
  console.log(`deleting single invoice by id ${invoiceId}`);
  let deletedInvoice = await _invoiceOps.deleteInvoiceById(invoiceId);
  let invoices = await _invoiceOps.getAllInvoices();

  if (deletedInvoice) {
    response.render("invoices", {
      title: "Billing - Clients",
      invoices: invoices,
      errorMessage: "",
      layout: "layouts/full-width"
    });
  } else {
    response.render("invoices", {
      title: "Billing - Clients",
      invoices: invoices,
      errorMessage: "Error.  Unable to Delete",
      layout: "layouts/full-width"
    });
  }
};
