const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/database');

class User {
  constructor(email, password, fullname) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
  }

  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);
    

    return db
      .getDb()
      .collection('users')
      .findOne({ _id: uid }, { projection: { password: 0 } });
  }

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
    await db.getDb().collection('users').insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.fullname,
    });
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

}

module.exports = User;
