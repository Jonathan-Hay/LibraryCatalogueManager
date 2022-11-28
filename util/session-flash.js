function getSessionData(req) {
    //retreive the data from the session into a variable 
    const sessionData = req.session.flashedData;
    //wipe the session data 
    req.session.flashedData = null;
    //the session is authomatically saved
    return sessionData;
  }
  
  //action is the function to be executed AFTER saving the data to the session. So we can ensure we only peform an action such as
  //redirecting AFTER the session was saved
  //we need the req object to access the session
function flashDataToSession(req, data, action) {
    //save data to session
    req.session.flashedData = data;
    //save data and execute the action function
    //Note, saving data is otherwise done automatically. We just need to do it this way if we want to ensure a cenrtain
    //action happens AFTER its finished saving.
    req.session.save(action);
  }
  
  module.exports = {
    getSessionData: getSessionData,
    flashDataToSession: flashDataToSession
  };