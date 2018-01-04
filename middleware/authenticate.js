var User = require('../models/User');

function authenticate(req,res,next){
  console.log(req.headers);
  var auth = req.headers['x-auth'];
  console.log(auth);
  User.authenticate(auth).then((doc)=>{
    req.body.user = doc;
    next();
  }).catch((err)=>{
    next(err);
  });
}

module.exports = authenticate;