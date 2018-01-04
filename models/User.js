var mongoose = require('../config/mongo');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var pick = require('lodash.pick');
var genError = require('../utils/CError');

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
          return Promise.reject(genError(401, 'User exists'));
        }
      });
  }

  genToken() {
    var user = this;
    var token = jwt.sign({ _id: user._id.toHexString() }, 'secret', { expiresIn: 30 * 60 }).toString();
    user.tokens.push({ token });
    return user.save().then(() => {
      return token;
    });
  }

  static login(user) {
    return this.findOne({ email: user.email })
      .then((doc) => {
        if (!doc) {
          return Promise.reject(genError(401, 'No such user exists'));
        } else {
          return doc;
        }
      })
      .then((doc) => {
        return new Promise((resolve, reject) => {
          bcrypt.compare(user.password, doc.password).then((res) => {
            if (res) {
              resolve(doc);
            } else {
              reject(genError(401, 'Invalid password'));
            }
          });
        });
      });
  }

  static logout(userJwt) {
    return new Promise((resolve, reject) => {
      jwt.verify(userJwt, 'secret', function (err, decoded) {
        if (err) {
          reject(genError(401, 'Invalid token'));
        } else {
          resolve();
          User.findById(decoded._id).then((doc) => {
            if(!doc) return;
            doc.tokens = [];
            doc.save();
          });
        }
      });
    });
  }

  static authenticate(userJwt) {
    return new Promise((resolve, reject) => {
      jwt.verify(userJwt, 'secret', function (err, decoded) {
        if (err) {
          reject(genError(401,'Token invalid'));
        }else{
          User.findById(decoded._id).then(resolve);
        }
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
});

var User = mongoose.model('User', userSchema);

module.exports = User;