const User = require("../models/User");
class UserData {
  async getUserByEmail(email) {
    let user = await User.findOne({ email: email });
    if (user) {
      const response = { obj: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }

  async getUserByUsername(username) {
    let user = await User.findOne(
      { username: username },
      { _id: 1, username: 1, email: 1, companyName: 1, companyCode: 1 }
    );
    if (user) {
      const response = { user: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }
  async getUserByUserId(id) {
    let user = await User.findOne(
      { _id: id },
      { _id: 1, username: 1, email: 1, companyName: 1, companyCode: 1 }
    );
    if (user) {
      const response = { user: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }

  async getRolesByUsername(username) {
    let user = await User.findOne({ username: username }, { _id: 0, roles: 1 });
    if (user.roles) {
      return user.roles;
    } else {
      return [];
    }
  }

  async updateUserProfileById(id, userObj) {
    console.log(`updating user profile by id ${id}`);
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

}



module.exports = UserData;
