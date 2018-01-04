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
    .catch(next);
});

router.post('/login', function (req, res, next) {
  var user = pick(req.body, ['email', 'password']);
  User.login(user)
    .then((doc) => {
      req.body = doc;
      next();
    })
    .catch(next);
});

//send 200 even if invalid to avoid bruteforce
router.post('/logout', function (req, res, next) {
  var userJwt = req.headers['x-auth'];
  var logoutResponse = (err)=>{
    res.sendStatus(200);
  };
  User.logout(userJwt)
    .then(logoutResponse)
    .catch(logoutResponse);
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
