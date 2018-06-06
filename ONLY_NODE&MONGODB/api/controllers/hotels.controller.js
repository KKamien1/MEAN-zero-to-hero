const dbconn = require('../data/dbconnection');
const ObjectId = require('mongodb').ObjectID;
const hotelData = require('../data/hotel-data.json');


module.exports.hotelsGetAll = function (req, res) {

  const db = dbconn.get();
  //console.log("DB:=====>", db);

  const collection = db.collection('hotels');
  //console.log("COLLECTION:=====>", collection);
  let offset = 0;
  let count = 5;

  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }

  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  collection
    .find()
    .skip(offset)
    .limit(count)
    .toArray(function (err, docs) {
      console.log(docs);
      res
        .status(200)
        .json(docs)
    });
};

module.exports.hotelsGetOne = function (req, res) {
  const db = dbconn.get();
  const collection = db.collection('hotels');

  const hotelId = req.params.hotelId;

  console.log("Get the hotel" + hotelId);
  collection
    .findOne({
      _id: ObjectId(hotelId)
    }, function (err, doc) {
      console.log(doc);
      res
        .status(200)
        .json(doc)

    })

};

module.exports.hotelsAddOne = function (req, res) {
  const db = dbconn.get();
  const collection = db.collection('hotels');
  let newHotel;
  console.log("post new hotel");

  if (req.body && req.body.name && req.body.stars) {
    newHotel = req.body;
    newHotel.stars = parseInt(req.body.stars, 10);
    console.log(newHotel);
    collection.insertOne(newHotel, function (err, response) {
      console.log(response);
      console.log(response.ops);
      res
        .status(201)
        .json(response.ops);
    })
  } else {
    console.log("Data missing from body");
    res
      .status(200)
      .json({
        message: "Required data missing from body"
      })
  }

}