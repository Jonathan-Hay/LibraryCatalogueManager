//a middleware to look at all requests to see if it is coming from an authenticated user

function checkAuthStatus(req, res, next) {
  //The createUserSession function from authentication.js is called in auth-controller when a user logs in.
  //It stores in the session the unsers unique id. So if the session doesn't have this id, they aren't authenticated
  const uid = req.session.uid;

  if (!uid) {
    //user isn't authenticated. Move to next middleware
    return next();
  }

  //If we get here, the usere must be authenticated. Therefore, we make it globally known
  //The user with this id is authenticated
  res.locals.uid = uid;
  //They are authenticated (same thing really)
  res.locals.isAuth = true;
  //if the user is is admin, save as global variable
  res.locals.isAdmin = req.session.isAdmin;
  // console.log("loclas: " + req.session.isAdmin);

  next();
}

module.exports = checkAuthStatus;
