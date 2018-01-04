var express = require('express');
var router = express.Router();
var authenticate = require('../middleware/authenticate');
var pick = require('lodash.pick');
var Location = require('../models/Location');

router.use(authenticate);

//keep method quick
router.post('/',function(req,res){
  res.sendStatus(200);
  var obj = pick(req.body,['user','longitude','latitude','time']);
  Location.add(obj);
});

router.get('/',function(req,res){
  var afterTime = req.query.time;
  Location.fetch(afterTime)
  .then((res)=>{
    console.log(res);
  });
});

module.exports = router;
