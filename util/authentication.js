//The action is a function that should be executed when the session is updated.
//i.e it would be a function saying go to a certain page. You only want this to happen after the update,
//or else you may land on a page you aren't verified for

function createUserSession(req, user, action) {
  //store in the session the user id, from mongodb.
  req.session.uid = user._id.toString();
  //if the user is an admin, save this to the session 
  req.session.isAdmin = user.isAdmin;

  //Save is a method which saves the data and then executes whatever function is provided inside
  req.session.save(action);
}

//Used to log out, wiping the session data
function destroyUserAuthSession(req) {
  req.session.uid = null;
  //We could call save here, like the function before. However as we are logging out, it isnt a huge concern
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
