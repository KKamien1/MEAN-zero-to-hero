const mongoose = require('mongoose');
const Hotel = mongoose.model('Hotel')


// const dbconn = require('../data/dbconnection');
// const ObjectId = require('mongodb').ObjectID;
// const hotelData = require('../data/hotel-data.json');


module.exports.hotelsGetAll = function (req, res) {

  // const db = dbconn.get();
  // const collection = db.collection('hotels');
  let offset = 0;
  let count = 5;

  const runGeoQuery = function (req, res) {

    const lng = parseFloat(req.query.lng)
    const lat = parseFloat(req.query.lat)

    const point = {
      type: "Point",
      coordinates: [lng, lat]
    };
    const geoOptions = {
      spherical: true,
      maxDistance: 6000,
      num: 5
    };

    Hotel
      .geoNear(point, geoOptions, function (err, results, stats) {
        console.log("Geo results", results);
        console.log("Geo stats", stats);
        res
          .status(200)
          .json(results);
      })
  };


  if (req.query && req.query.lat && req.query.lng) {
    runGeoQuery(req, res);
    return;
  }
  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }

  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  if (isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({
        "message": "If supplied in querystring count and offset should be number "
      });
    return;
  }

  Hotel
    .find()
    .skip(offset)
    .limit(count)
    .exec(function (err, hotels) {
      if (err) {
        console.log("Error finding hotels");
        res
          .status(500)
          .json(err);
      } else {
        console.log("Found hotels", hotels.length);
        res
          .json(hotels)
      }
    })

  // collection
  //   .find()
  //   .skip(offset)
  //   .limit(count)
  //   .toArray(function (err, docs) {
  //     console.log(docs);
  //     res
  //       .status(200)
  //       .json(docs)
  //   });
};

module.exports.hotelsGetOne = function (req, res) {
  // const db = dbconn.get();
  // const collection = db.collection('hotels');

  const hotelId = req.params.hotelId;

  console.log("Get the hotel" + hotelId);
  Hotel
    .findById(hotelId)
    .exec(function (err, hotel) {

      if (err) {
        console.log("Error finding hotel");
        res
          .status(500)
          .json(err)

      } else if (!hotel) {
        res
          .status(404)
          .json({
            "message": "Hotel ID not found"
          })
      } else {

        console.log(hotel);
        res
          .status(200)
          .json(hotel)
      }

    })

};

const _splitArray = function (input) {
  let output;
  if (input && input.length > 0) {
    output = input.split(";");
  } else {
    output = [];
  }
  return output;
}

module.exports.hotelsAddOne = function (req, res) {
  Hotel
    .create({
      name: req.body.name,
      description: req.body.description,
      stars: parseInt(req.body.stars, 10),
      services: _splitArray(req.body.services),
      photos: _splitArray(req.body.photos),
      currency: req.body.currency,
      location: {
        address: req.body.address,
        coordinates: [
          parseFloat(req.body.lng),
          parseFloat(req.body.lat)
        ]
      }
    }, function (err, hotel) {
      if (err) {
        console.log("Error creating hotel");
        res
          .status(400)
          .json(err);
      } else {
        console.log("Hotel created", hotel);
        res
          .status(201)
          .json(hotel);

      }
    })
}

module.exports.hotelsUpdateOne = function (req, res) {

  const hotelId = req.params.hotelId;
  console.log("Update the hotel" + hotelId);
  Hotel
    .findById(hotelId)
    .select("-reviews -rooms")
    .exec(function (err, hotel) {
      let response = {
        status: 200,
        message: hotel
      };

      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if (!hotel) {
        response.status = 404;
        response.message = {
          "message": "Hotel ID not found"
        };
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        hotel.name = req.body.name;
        hotel.description = req.body.description;
        hotel.stars = parseInt(req.body.stars, 10);
        hotel.services = _splitArray(req.body.services);
        hotel.photos = _splitArray(req.body.photos);
        hotel.currency = req.body.currency;
        hotel.location = {
          address: req.body.address,
          coordinates: [
            parseFloat(req.body.lng),
            parseFloat(req.body.lat)
          ]
        };

        hotel.save(function (err, hotelsUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        })

      }

    })

}

module.exports.hotelsDeleteOne = function (req, res) {
  const hotelId = req.body.hotelId;
  Hotel
    .findByIdAndRemove(hotelId)
    .exec(function (err, hotel) {
      if (err) {
        res
          .status(404)
          .json(eff);
      } else {
        console.log("Hotel delete, id:", hotelId);
        res
          .status(204)
          .json()
      }
    })

}