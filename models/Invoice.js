const mongoose = require("mongoose");
const Profile = require("./Profile");
const Product = require("./Product")
const Schema = mongoose.Schema;
const invoiceSchema = new Schema({
   
    invoiceNumber: {type: String, required:true, unique:true },
    profile:{type:Profile.schema, required: true},
    issueDate: {type: Date, default: Date.now},
    dueDate: {type: Date, required:false},
    product:{type:Product.schema, required: true},
    totalDue:{type:"Number", required: false},

},
    {collection: "invoices"}
);
const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;