function userDetailsAreValid(email, password, name) {
  const userCredentialsAreValid = email && email.includes("@") && password && password.trim().length >= 6;
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
