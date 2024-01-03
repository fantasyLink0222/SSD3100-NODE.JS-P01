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

exports.Index = async function (req, res) {
  console.log("loading users from controller");
  let users = await _userOps.getAllUsers();
  if (users) {
    res.render("users", {
      title: "Billing - Clients",
      users: users,
      layout: "layouts/full-width",
      errorMessage: "",
    });
  } else {
    res.render("users", {
      title: "Billing - Clients",
      users: [],
      errorMessage: "",
      layout: "layouts/full-width"
    });
  }
};

exports.Detail = async function (req, res) {
  const userId = req.params.id;
  console.log(`loading single user by id ${userId}`);
  let user = await _userOps.getUserById(userId);
  let users = await _userOps.getAllUsers();

  if (user) {
    res.render("userDetails", {
      title: "Express Yourself - " + user.name,
      users: users,
      userId: req.params.id,
      user: user,
      layout: "layouts/full-width"
    });
  } else {
    res.render("users", {
      title: "Billing - Clients",
      users: [],
      layout: "layouts/full-width"
    });
  }
};

// Handle user form GET req
exports.Create = async function (req, res) {
  res.render("user-create", {
    title: "Create User",
    errorMessage: "",
    user: {},
    layout: "layouts/full-width"
  });
};

// Handle user form GET req
exports.CreateUser = async function (req, res) {
  // instantiate a new User Object populated with form data
  let tempUserObj = new User({
    companyName: req.body.companyName,
    companyCode: req.body.companyCode,
    email: req.body.email,
    username: req.body.username,
    roles:req.body.roles||"RegUser",
  });

  //
  let resObj = await _userOps.createUser(tempUserObj);

  // if no errors, save was successful
  if (resObj.errorMsg == "") {
    let users = await _userOps.getAllUsers();
    console.log(resObj.obj);
    res.render("users", {
      title: "Express Billing - " + resObj.obj.name,
      users: users,
      userId: resObj.obj._id.valueOf(),
      layout: "layouts/full-width"
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    console.log("An error occured. Item not created.");
    res.render("user-create", {
      title: "Create User",
      user: resObj.obj,
      errorMessage: resObj.errorMsg,
      layout: "layouts/full-width"
    });
  }
};
//handle edit by id
exports.Edit = async function (req, res) {
  const userId = req.params.id;
  let userObj = await _userOps.getUserById(userId);
  res.render("userEdit", {
    title: "Edit User",
    errorMessage: "",
    user_id: userId,
    user: userObj,
  });
};


// Handle user edit form submission
exports.EditUser = async function (req, res) {
  const userId = req.params.id;
  
  const userObj = {
    companyName: req.body.companyName,
    companyCode: req.body.companyCode,
    email: req.body.email,
    username: req.body.username,
    roles: req.body.roles,
    
  }
  console.log(`This is the user id${userId}`);
  // send these to userOps to update and save the document
  let resObj = await _userOps.updateUserById(userId,userObj);

  // if no errors, save was successful
  if (resObj.errorMsg == "") {
    let users = await _userOps.getAllUsers();
    console.log(resObj.obj);
    res.render("userDetails", {
      title: "Express Billing - " + resObj.obj.name,
      users: users,
      userId: resObj.obj._id.valueOf(),
      layout: "layouts/full-width"
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    console.log("An error occured. Item not created.");
    res.render("userEdit", {
      title: "Edit User",
      user: resObj.obj,
      user_id: userId,
      errorMessage: resObj.errorMsg,
    });
  }
};

// Handle user form GET req
exports.DeleteUserById = async function (req, res) {
  const userId = req.params.id;
  console.log(`deleting single user by id ${userId}`);
  let deletedUser = await _userOps.deleteUserById(userId);
  let users = await _userOps.getAllUsers();

  if (deletedUser) {
    res.render("users", {
      title: "Billing - Clients",
      users: users,
      errorMessage: "",
      layout: "layouts/full-width"
    });
  } else {
    res.render("users", {
      title: "Billing - Clients",
      users: users,
      errorMessage: "Error.  Unable to Delete",
      layout: "layouts/full-width"
    });
  }
};
