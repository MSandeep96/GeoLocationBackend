var express = require('express');
var router = express.Router();
var pick = require('lodash.pick');
var User = require('../models/User');

router.post('/signup', function (req, res, next) {
  var user = pick(req.body, ['email', 'password']);
  User.createUser(user)
    .then((doc) => {
      req.body = doc;
      next();
    })
    .catch((err) => {
      res.status(401).send({
        'error':err
      });
    });
});

router.post('/login', function (req, res, next) {
  var user = pick(req.body, ['email', 'password']);
  User.login(user)
    .then((doc) => {
      req.body = doc;
      next();
    })
    .catch((err) => {
      res.status(401).send({
        'error':err
      });
    });
});

router.post('/facebook', function (req, res, next) {

});

router.post('/google', function (req, res, next) {

});

router.use(function (req, res) {
  var user = req.body;
  user.genToken().then((token) => {
    res.header('x-auth', token).send(user);
  });
});

module.exports = router;
