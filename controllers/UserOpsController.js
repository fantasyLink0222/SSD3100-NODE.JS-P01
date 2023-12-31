const User = require("../models/User.js");
const UserOps = require("../data/UserOps.js");

const _userOps = new UserOps();

exports.searchUsers = async function(req, res) {
  const searchQuery = req.query.q;

  try {
    const users = await _userOps.find({
      name: { $regex: searchQuery, $options: "i" }
    });

    res.render("users", { users: users, layout: "layouts/full-width" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.Index = async function (request, response) {
  console.log("loading users from controller");
  let users = await _userOps.getAllUsers();
  if (users) {
    response.render("users", {
      title: "Billing - Clients",
      users: users,
      layout: "layouts/full-width",
      errorMessage: "",
    });
  } else {
    response.render("users", {
      title: "Billing - Clients",
      users: [],
      errorMessage: "",
      layout: "layouts/full-width"
    });
  }
};

exports.Detail = async function (request, response) {
  const userId = request.params.id;
  console.log(`loading single user by id ${userId}`);
  let user = await _userOps.getUserById(userId);
  let users = await _userOps.getAllUsers();

  if (user) {
    response.render("userDetails", {
      title: "Express Yourself - " + user.name,
      users: users,
      userId: request.params.id,
      user: user,
      layout: "layouts/full-width"
    });
  } else {
    response.render("users", {
      title: "Billing - Clients",
      users: [],
      layout: "layouts/full-width"
    });
  }
};

// Handle user form GET request
exports.Create = async function (request, response) {
  response.render("user-create", {
    title: "Create User",
    errorMessage: "",
    user: {},
    layout: "layouts/full-width"
  });
};

// Handle user form GET request
exports.CreateUser = async function (request, response) {
  // instantiate a new User Object populated with form data
  let tempUserObj = new User({
    companyName: req.body.companyName,
    companyCode: req.body.companyCode,
    email: req.body.email,
    username: req.body.username,
  });

  //
  let responseObj = await _userOps.createUser(tempUserObj);

  // if no errors, save was successful
  if (responseObj.errorMsg == "") {
    let users = await _userOps.getAllUsers();
    console.log(responseObj.obj);
    response.render("users", {
      title: "Express Billing - " + responseObj.obj.name,
      users: users,
      userId: responseObj.obj._id.valueOf(),
      layout: "layouts/full-width"
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    console.log("An error occured. Item not created.");
    response.render("user-create", {
      title: "Create User",
      user: responseObj.obj,
      errorMessage: responseObj.errorMsg,
      layout: "layouts/full-width"
    });
  }
};
//handle edit by id
exports.Edit = async function (request, response) {
  const userId = request.params.id;
  let userObj = await _userOps.getUserById(userId);
  response.render("userEdit", {
    title: "Edit User",
    errorMessage: "",
    user_id: userId,
    user: userObj,
  });
};


// Handle user edit form submission
exports.EditUser = async function (request, response) {
  const userId = request.body.user_id;
  
  const userObj = {
    companyName: req.body.companyName,
    companyCode: req.body.companyCode,
    email: req.body.email,
    username: req.body.username,
    
  }
  console.log(`This is the user id${userId}`);
  // send these to userOps to update and save the document
  let responseObj = await _userOps.updateUserById(userId,userObj);

  // if no errors, save was successful
  if (responseObj.errorMsg == "") {
    let users = await _userOps.getAllUsers();
    console.log(responseObj.obj);
    response.render("users", {
      title: "Express Billing - " + responseObj.obj.name,
      users: users,
      userId: responseObj.obj._id.valueOf(),
      layout: "layouts/full-width"
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    console.log("An error occured. Item not created.");
    response.render("userEdit", {
      title: "Edit User",
      user: responseObj.obj,
      user_id: userId,
      errorMessage: responseObj.errorMsg,
    });
  }
};

// Handle user form GET request
exports.DeleteUserById = async function (request, response) {
  const userId = request.params.id;
  console.log(`deleting single user by id ${userId}`);
  let deletedUser = await _userOps.deleteUserById(userId);
  let users = await _userOps.getAllUsers();

  if (deletedUser) {
    response.render("users", {
      title: "Billing - Clients",
      users: users,
      errorMessage: "",
      layout: "layouts/full-width"
    });
  } else {
    response.render("users", {
      title: "Billing - Clients",
      users: users,
      errorMessage: "Error.  Unable to Delete",
      layout: "layouts/full-width"
    });
  }
};
