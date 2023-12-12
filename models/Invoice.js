const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const invoiceSchema = new Schema({
    invoiceNumber: {
        type: String ,
        required:true,
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
      
    },

},
    {collection: "invoices"}
);
const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;