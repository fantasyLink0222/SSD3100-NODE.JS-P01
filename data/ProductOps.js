const Product = require("../models/Product.js");

class ProductOps {
  ProductOps() {}

  async getAllProducts() {
    try{
      console.log("fetching all products");
    const products = await Product.find({}).sort({productName: 1});
    return products;
    } catch (error){
      console.error("Error fetching products: ", error);
      throw error;
    }
  }

  async getProductById(id) {
    try{
      console.log("fetching product by id")
      const product = await Product.findById(id);
      return product;
    } catch (error){
      console.error("Error fetching products by id: ", error);
      throw error;
    }
  }

  async createProduct(productObj) {
    try{
      const error = await productObj.validateSync();
      if(error){
        const response = {
          obj: productObj,
          errorMsg: error.message
        };
        return response;
      }
      const result = await productObj.save();
      const response = {
        obj: result, 
        errorMsg: ""
      };
      return response;
    } catch(error) {
      const response = {
        obj: productObj,
        errorMsg: error.message
      };
      return response;
    }
  }

  async updateProductById(id, productObj) {
    console.log(`updating product by id ${id}`);
    const product = await Product.findById(id);
    for (const key in productObj) {
      product[key] = productObj[key]
    }
    console.log("original product: ", product);
    let result = await product.save();
    console.log("updated product: ", result);
    return {
      obj: result,
      errorMsg: ""
    };
  }

  async deleteProduct(id) {
    try {
      console.log(`deleting product by id ${id}`);
      const deletedProduct = await Product.findByIdAndDelete(id);
      console.log(deletedProduct);
      return deletedProduct;
    } catch (error) {
      console.error("Error deleting product: ", error);
      throw error;
    }
  }

  async find(query) {
    try {
      const products = await Product.find(query);
      return products;
    } catch (error) {
      throw new Error(`Error finding products: ${error.message}`);
    }
  }
  
}



module.exports = ProductOps;