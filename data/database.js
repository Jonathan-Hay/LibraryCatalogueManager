const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
  //connect to a mongodb server
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  //conect to our specfic database
  database = client.db("library-website");
}

function getDb() {
  //in case for some reason the database is accessed before the connection is made
  if (!database) {
    throw new Error("You must connect first!");
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
