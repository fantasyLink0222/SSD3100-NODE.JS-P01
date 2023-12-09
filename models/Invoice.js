const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const invoiceSchema = new Schema({
    issueDate: {
        type: Date,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    products:[{ type: Schema.Types.ObjectId, ref: "Product" }],
    payee:[{ type: Schema.Types.ObjectId, ref:"Profile"}],
},
    {collection: "invoices"}
);
const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;