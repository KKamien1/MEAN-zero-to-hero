const mongoose = require('mongoose');

const dburl = 'mongodb://localhost:27017/dbhotels'

mongoose.connect(dburl);

// Mongoose EVENTS
mongoose.connection.on('connected', function () {
  console.log("Mongoose connected to" + dburl);
});
mongoose.connection.on('disconnected', function () {
  console.log("Mongoose disconnected with" + dburl);
});
mongoose.connection.on('error', function (err) {
  console.log("Mongoose connection error" + err);
});

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected through app termination (SIGInT)");
    process.exit(0);
  })
})
process.on('SIGTERM', function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected through app termination (SIGTERM)");
    process.exit(0);
  })
})
process.once('SIGUSR2', function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected through app termination (SIGUSR2)");
    process.kill(process.pid, 'SIGUSR2');
  })
})


/// BRING IN SCHEMA AND MODELS

require('./hotels.model')
require('./users.model')