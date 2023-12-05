const Profile = require("../models/Profile.js");
const ProfileOps = require("../data/ProfileOps");

const _profileOps = new ProfileOps();

exports.searchProfiles = async function(req, res) {
  const searchQuery = req.query.q;

  try {
    const profiles = await _profileOps.find({
      name: { $regex: searchQuery, $options: "i" }
    });

    res.render("profiles", { profiles: profiles, layout: "layouts/full-width" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.Index = async function (request, response) {
  console.log("loading profiles from controller");
  let profiles = await _profileOps.getAllProfiles();
  if (profiles) {
    response.render("profiles", {
      title: "Billing - Clients",
      profiles: profiles,
      layout: "layouts/full-width",
      errorMessage: "",
    });
  } else {
    response.render("profiles", {
      title: "Billing - Clients",
      profiles: [],
      errorMessage: "",
      layout: "layouts/full-width"
    });
  }
};

exports.Detail = async function (request, response) {
  const profileId = request.params.id;
  console.log(`loading single profile by id ${profileId}`);
  let profile = await _profileOps.getProfileById(profileId);
  let profiles = await _profileOps.getAllProfiles();

  if (profile) {
    response.render("profileDetails", {
      title: "Express Yourself - " + profile.name,
      profiles: profiles,
      profileId: request.params.id,
      profile: profile,
      layout: "layouts/full-width"
    });
  } else {
    response.render("profiles", {
      title: "Billing - Clients",
      profiles: [],
      layout: "layouts/full-width"
    });
  }
};

// Handle profile form GET request
exports.Create = async function (request, response) {
  response.render("profile-create", {
    title: "Create Profile",
    errorMessage: "",
    profile: {},
    layout: "layouts/full-width"
  });
};

// Handle profile form GET request
exports.CreateProfile = async function (request, response) {
  // instantiate a new Profile Object populated with form data
  let tempProfileObj = new Profile({
    name: request.body.name,
    code: request.body.code,
    company: request.body.company,
    email: request.body.email
  });

  //
  let responseObj = await _profileOps.createProfile(tempProfileObj);

  // if no errors, save was successful
  if (responseObj.errorMsg == "") {
    let profiles = await _profileOps.getAllProfiles();
    console.log(responseObj.obj);
    response.render("profiles", {
      title: "Express Billing - " + responseObj.obj.name,
      profiles: profiles,
      profileId: responseObj.obj._id.valueOf(),
      layout: "layouts/full-width"
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    console.log("An error occured. Item not created.");
    response.render("profile-create", {
      title: "Create Profile",
      profile: responseObj.obj,
      errorMessage: responseObj.errorMsg,
      layout: "layouts/full-width"
    });
  }
};
//handle edit by id
exports.Edit = async function (request, response) {
  const profileId = request.params.id;
  let profileObj = await _profileOps.getProfileById(profileId);
  response.render("profileEdit", {
    title: "Edit Profile",
    errorMessage: "",
    profile_id: profileId,
    profile: profileObj,
  });
};


// Handle profile edit form submission
exports.EditProfile = async function (request, response) {
  const profileId = request.body.profile_id;
  
  const profileObj = {
    name: request.body.name,
    code: request.body.code,
    company: request.body.company,
    email:request.body.email
  }
  console.log(`This is the profile id${profileId}`);
  // send these to profileOps to update and save the document
  let responseObj = await _profileOps.updateProfileById(profileId,profileObj);

  // if no errors, save was successful
  if (responseObj.errorMsg == "") {
    let profiles = await _profileOps.getAllProfiles();
    console.log(responseObj.obj);
    response.render("profiles", {
      title: "Express Billing - " + responseObj.obj.name,
      profiles: profiles,
      profileId: responseObj.obj._id.valueOf(),
      layout: "layouts/full-width"
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    console.log("An error occured. Item not created.");
    response.render("profileEdit", {
      title: "Edit Profile",
      profile: responseObj.obj,
      profile_id: profileId,
      errorMessage: responseObj.errorMsg,
    });
  }
};

// Handle profile form GET request
exports.DeleteProfileById = async function (request, response) {
  const profileId = request.params.id;
  console.log(`deleting single profile by id ${profileId}`);
  let deletedProfile = await _profileOps.deleteProfileById(profileId);
  let profiles = await _profileOps.getAllProfiles();

  if (deletedProfile) {
    response.render("profiles", {
      title: "Billing - Clients",
      profiles: profiles,
      errorMessage: "",
      layout: "layouts/full-width"
    });
  } else {
    response.render("profiles", {
      title: "Billing - Clients",
      profiles: profiles,
      errorMessage: "Error.  Unable to Delete",
      layout: "layouts/full-width"
    });
  }
};
