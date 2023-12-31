const User = require("../models/User");

class UserOps {
  // empty constructor
  UserOps() {}

  // DB methods
  async getAllUsers() {
    console.log("getting all users");
    let users = await User.find().sort({ name: 1 });
    return users;
  }

  async getUserById(id) {
    console.log(`getting User by id ${id}`);
    let user = await User.findById(id);
    return user;
  }

  async createUser(userObj) {
    try {
      const error = await userObj.validateSync();
      if (error) {
        const response = {
          obj: userObj,
          errorMsg: error.message,
        };
        return response; // Exit if the model is invalid
      }

      // Model is valid, so save it
      const result = await userObj.save();
      const response = {
        obj: result,
        errorMsg: "",
      };
      return response;
    } catch (error) {
      const response = {
        obj: userObj,
        errorMsg: error.message,
      };
      return response;
    }
  }

  async updateUserById(id, userObj) {
    console.log(`updating user by id ${id}`);
    const user = await User.findById(id);
    for (const key in userObj) {
      user[key] = userObj[key]
    }
   
    let result = await user.save();
    console.log("updated user: ", result);
    return {
      obj: result,
      errorMsg: "",
    };
  }
  

  async deleteUserById(id) {
    console.log(`deleting user by id ${id}`);
    let result = await User.findByIdAndDelete(id);
    console.log(result);
    return result;
  }

  //method for searchbar 
  async find(query) {
    try {
      const products = await User.find(query);
      return products;
    } catch (error) {
      throw new Error(`Error finding products: ${error.message}`);
    }
  }

  
}

module.exports = UserOps;
