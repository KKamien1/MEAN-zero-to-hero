const mongoose = require('mongoose');

// review schema preparation = it will be subdocument
const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    "default": Date.now
  }

}, {
  usePushEach: true
});

const roomSchema = new mongoose.Schema({
  type: String,
  number: Number,
  description: String,
  photos: [String],
  price: Number
})


// MAIN schema of HOTEL
const hotelScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  services: [String],
  description: String,
  photos: [String],
  currency: String,
  reviews: [reviewSchema],
  rooms: [roomSchema],
  location: {
    address: String,
    // always store coordinates longitude (E/W), latitude (N/S)
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  }
});

mongoose.model('Hotel', hotelScheme)