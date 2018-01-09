var User = require('../models/User');

function authenticate(req,res,next){
  var auth = req.headers['x-auth'];
  User.authenticate(auth).then((doc)=>{
    req.body.user = doc;
    next();
  }).catch((err)=>{
    next(err);
  });
}

module.exports = authenticate;