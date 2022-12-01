const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/database');

class User {
  constructor(email, password, fullname) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
  }

  //return the user with the given id
  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);
    

    return db
      .getDb()
      .collection('users')
      // we dont want to get the password, we dont need it, but everything else
      .findOne({ _id: uid }, { projection: { password: 0 } });
  }

  //Checks if any other user has the same email, and return them if they exist 
  getUserWithSameEmail() {
    return db.getDb().collection('users').findOne({ email: this.email })
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail()

    if (existingUser) {
      return true;
    }

    return false;

  }


  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    //create users collection if it doesnt exist already
    await db.getDb().collection('users').insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.fullname,
    });
  }

  //checkcs if the entered password for this user matches the hashed password in the database 
  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

}

module.exports = User;
