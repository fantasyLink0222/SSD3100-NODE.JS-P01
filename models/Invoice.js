const mongoose = require("mongoose");
const User = require("./User");
const Product = require("./Product")
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
   
    invoiceNumber: {type: String, required:true, unique:true },
    user:{ type: User.schema, required: true },
    issueDate: {type: Date, default: Date.now},
    dueDate: {type: Date, required:false,validate: [dateValidator, 'dueDate must be later than the invoice issue date']},
    products:{type:Array, required: true},
    totalDue:{type:"Number", required: false},

},
    {collection: "invoices"}
);
function dateValidator(value) {
    return this.issueDate < value;
  }
const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;