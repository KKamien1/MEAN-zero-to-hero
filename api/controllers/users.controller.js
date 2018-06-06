const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');


module.exports.register = function (req, res) {
  console.log('registering user');

  const username = req.body.username;
  const name = req.body.name || null;
  const password = req.body.password;

  User.create({
    username,
    name,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }, function (err, user) {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    } else {
      console.log('user created', user);
      res.status(201).json(user);
    }
  })
}

module.exports.login = function (req, res) {
  console.log('logging in user');
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    username: username
  }).exec(function (err, user) {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        console.log('User found', user);
        const token = jwt.sign({
          username: user.username
        }, 's3cr3t', {
          expiresIn: 3600
        });
        res.status(200).json({
          success: true,
          token: token
        });
      } else {
        res.status(401).json('Unauthorized');
      }
    }
  })
}

module.exports.authenticate = function (req, res, next) {
  const headerExists = req.headers.authorization;
  if (headerExists) {
    const token = req.headers.authorization.split(' ')[1]; // --> Authorization Bearer xxx
    jwt.verify(token, 's3cr3t', function (err, decoded) {
      if (err) {
        console.log(err);
        res.status(401).json('Unauthorized');
      } else {
        req.user = decoded.username;
        next()
      }
    })
  } else {
    res.status(403).json('No token provided')
  }
}