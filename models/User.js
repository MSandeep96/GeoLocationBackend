var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens : [{
    token: String
  }]
});

class UserClass{

}

userSchema.loadClass(UserClass);

var User = mongoose.model('User',userSchema);

module.exports = User;