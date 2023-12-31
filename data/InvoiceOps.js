const Invoice = require("../models/Invoice.js");

class InvoiceOps {
  InvoiceOps() {}

  async getAllInvoices() {
    try{
      console.log("fetching all invoices");
    const invoices = await Invoice.find({});
    return invoices;
    } catch (error){
      console.error("Error fetching invoices: ", error);
      throw error;
    }
  }


  async getUserInvoices(username) {
    try {
      console.log("Fetching all invoices for a certain user");
      // Directly find invoices for the given username
      const userInvoices = await Invoice.find({ "user.username": username });
  
      return userInvoices;
    } catch (error) {
      console.error("Error fetching invoices: ", error);
      throw error;
    }
  }

  async getInvoiceById(id) {
    try{
      console.log("fetching invoice by id")
      const invoice = await Invoice.findById(id);
      return invoice;
    } catch (error){
      console.error("Error fetching invoices by id: ", error);
      throw error;
    }
  }

  async createInvoice(invoiceObj) {
    try{
      const error = await invoiceObj.validateSync();
      if(error){
        const response = {
          obj: invoiceObj,
          errorMsg: error.message
        };
        return response;
      }
      const result = await invoiceObj.save();
      const response = {
        obj: result, 
        errorMsg: ""
      };
      return response;
    } catch(error) {
      const response = {
        obj: invoiceObj,
        errorMsg: error.message
      };
      return response;
    }
  }

 

  async deleteInvoiceById(id) {
    try {
      console.log(`deleting invoice by id ${id}`);
      const deletedInvoice = await Invoice.findByIdAndDelete(id);
      console.log(deletedInvoice);
      return deletedInvoice;
    } catch (error) {
      console.error("Error deleting invoice: ", error);
      throw error;
    }
  }

  async find(query) {
    try {
      const invoices = await Invoice.find(query);
      return invoices;
    } catch (error) {
      throw new Error(`Error finding invoices: ${error.message}`);
    }
  }
  
  async markInvoiceAsPaidById(id) {
    try{

    console.log(`mark invoice as paid by id ${id}`);
    const result = await Invoice.findByIdAndUpdate(id,{paid:true});
   

    console.log("updated invoice: ", result);
    return {
      obj: result,
      errorMsg: "",
    };

    }catch (error) {
      console.error("Error deleting invoice: ", error);
      throw error;
    }
    
  }
  


}



module.exports = InvoiceOps;