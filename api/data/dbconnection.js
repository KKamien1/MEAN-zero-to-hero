const MongoClient = require('mongodb').MongoClient;
const dburl = 'mongodb://localhost:27017/dbhotels';
//const dbName = 'dbhotels';

let _connection = null;

const open = function () {
  // set connection
  MongoClient.connect(dburl, function (err, db) {
    if (err) {
      console.log("DB connection failed", err);
      return;
    }

    //const db = client.db(dbName);

    console.log("DB connection open");

    _connection = db;
  })
};

const get = function () {
  return _connection;
}

module.exports = {
  open,
  get
}