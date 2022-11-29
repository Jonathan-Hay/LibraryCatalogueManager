//checks all the input details are valid
//If we just relied on the html validation (requried tag for example), users could just remove it using dev tools
//we need validation on backend too. (With this backend validation, the html validation could tehcnically
//be removed)

function userDetailsAreValid(email, password, name) {
  //check the email exists, looks like an email i.e includes '@', and password is of a decent size
  const userCredentialsAreValid = email && email.includes("@") && password && password.trim().length >= 6;
  //Check if a value doesn't exist or empty string entered
  const isEmpty = !name || name.trim() === "";

  return userCredentialsAreValid && !isEmpty;
}

function emailIsConfirmed(email, confirmEmail) {
  return email === confirmEmail;
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirmed: emailIsConfirmed,
};
