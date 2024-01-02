const RequestService = require("../services/RequestService");
exports.Index = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    return res.render("secure/secure-area", { reqInfo: reqInfo });
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be logged in to view this page."
    );
  }
};

// Admin area is available only to users who belong to Admin role
exports.Admin = async function (req, res, next) {
  let reqInfo = RequestService.reqHelper(req, ["Admin"]);
  if (reqInfo.rolePermitted) {
    // Attach reqInfo to res.locals to make it available in the view
    res.locals.reqInfo = reqInfo;
    return next();
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be an admin to access this area."
    );
  }
};

// Manager Area is available only to users who belong to Admin and/or Manager role
exports.Manager = async function (req, res, next) {
  let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);
  if (reqInfo.rolePermitted) {
    res.locals.reqInfo = reqInfo;
    return next();
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be a manager or admin to access this area."
    );
  }
};
// Manager Area is available only to users who belong to Admin and/or Manager role

