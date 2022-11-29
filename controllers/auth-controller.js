const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
  //get the session data, if any exist. (i.e some already entered inputs, but its invalid.
  //We dont want this info to dsisapear and user need to enter it again after the redirect)

  let sessionData = sessionFlash.getSessionData(req);

  //if no session data, set the session data to defaults (i,e first time entering the data)
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      fullname: "",
      street: "",
      postal: "",
      city: "",
    };
  }
  //In app.js we said the templating engine would use the views folder but we need to specify the path inside the views
  //folder since we have multiple folders INSIDE views
  //We give it the sessionData to display, if it exists

  res.render("auth/signup", { inputData: sessionData });

  // res.render("auth/signup");
}

async function signup(req, res, next) {
  //We need to check if all our input fields are valid. Although some of this is checked in the browser, like min length = 5 etc
  //this could be changed using the browser dev tools so we need to validate it on backend too

  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
    //confirm-email has a - in it so need to use square notiation
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "Check your input, password must be < 6 chars. Postal code < 5 chars.",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  //input is validated at this point, now try to create a user
  const user = new User(req.body.email, req.body.password, req.body.fullname);

  //express ignores errors that occur inside async operations,
  //so our error handling middleware does not kick in.We need to deal with this oursleves
  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User exists already",
          ...enteredData,
        },
        function () {
          res.redirect("signup");
        }
      );
      return;
    }

    await user.signup();
  } catch (error) {
    //passing error to next will active the default error handling middleware, rendering the 500 template
    next(error);
    //stop code executing
    return;
  }
  //typically we redirect to somehwere after form submission, so the user cant submit the info again
  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  // if no session data, set the session data to defaults (i,e first time entering the data)
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  res.render("auth/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  //check if a user already exists for that email

  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    //passing error to next will active the default error handling middleware, rendering the 500 template
    next(error);
    //stop code executing
    return;
  }

  const sessionErrorData = {
    errorMessage: "Invalid credentials check email and password",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  //check if the user logging in is in fact the existing user on the database, i.e they have the pw for that
  //account
  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  //if we get to this point we know the email is correct and the password is correct
  //Therefore we want to "log them in" i.e, store info on the session to say this user can access certain
  //data

  console.log("logged in");

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

//"Logging out" is just removing some data from the session, thats all.
function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
