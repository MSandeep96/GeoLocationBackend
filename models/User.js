var mongoose = require('../config/mongo');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var pick = require('lodash.pick');

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
  tokens: [{
    token: String
  }]
});

class UserClass {

  static createUser(user) {
    return this.findOne({ email: user.email })
      .then(doc => {
        if (!doc) {
          return new User(user).save();
        } else {
          return Promise.reject('User exists');
        } 
      });
  }

  genToken() {
    var user = this;
    var token = jwt.sign({ _id: user._id.toHexString() }, 'secret').toString();
    user.tokens.push({ token });
    return user.save().then(() => {
      return token;
    });
  }

  static login(user) {
    return this.findOne({ email: user.email })
      .then((doc) => {
        if (!doc) {
          return Promise.reject('No such user exists');
        } else {
          return doc;
        }
      })
      .then((doc)=>{
        return new Promise((resolve,reject)=>{
          bcrypt.compare(user.password, doc.password).then((res) => {
            if (res) {
              resolve(doc);
            } else {
              reject('Invalid password');
            }
          });
        });
      });
  }
}

userSchema.loadClass(UserClass);

userSchema.methods.toJSON = function () {
  var user = this.toObject();
  return pick(user, ['_id', 'email']);
}

userSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
})

var User = mongoose.model('User', userSchema);

module.exports = User;