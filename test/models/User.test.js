var User = require('../../models/User');
var mongoose = require('../../config/mongo');
var expect = require('chai').expect;
var should = require('chai').should();
var assert = require('chai').assert;
var bcrypt = require('bcrypt');

before(function connectToDBU(done) {
  if (mongoose.connection.readyState === 1) done();
  else
    mongoose.connection.on('connected', done);
});

describe('User Schema', function () {

  it('should fail as invalid password', function (done) {
    var user = new User({ email: 'fsdkjf@gmail.com', password: 'fsfa' });
    user.save().then((doc) => {
      throw new Error("Saved with errors");
    })
      .catch((err) => {
        done();
      });
  });

});

describe('#createUser()', function () {

  before(function createUser(done) {
    User.createUser({ email: 'fa@fa.com', password: 'bailando' })
      .then((doc) => {
        done();
      })
      .catch((err) => {
        throw err;
      });
  });

  it('should create a user', function (done) {
    User.findOne().then((doc) => {
      should.exist(doc);
      done();
    });
  });

  it('should fail as duplicate', function (done) {
    User.createUser({ email: 'fa@fa.com', password: 'bailando' })
      .then((doc) => {
        throw new Error('Doc created');
      })
      .catch((err) => {
        done();
      });
  });

  after(function deleteUser(done) {
    User.findOneAndRemove({ email: 'fa@fa.com' }).then((doc) => {
      done();
    });
  });

});

describe('#loginUser()', function () {

  before(function create(done) {
    User.createUser({ email: 'fa@fa.com', password: 'bailando' })
      .then((doc) => {
        done();
      })
      .catch((err) => {
        throw err;
      });
  });

  it('should login the user', function (done) {
    User.login({ email: 'fa@fa.com', password: 'bailando' })
      .then((doc) => {
        done();
      })
      .catch((err) => {
        throw err;
      });
  });

  it('should fail as invalid password', function (done) {
    User.login({ email: 'fa@fa.com', password: 'bailando' })
      .then((doc) => {
        throw new Error();
      })
      .catch((err) => {
        done();
      });
  });

  it('should fail as no such user', function (done) {
    User.login({ email: 'fa@fa.com', password: 'bailando' })
      .then((doc) => {
        throw new Error();
      })
      .catch((err) => {
        done();
      });
  });

  after(function deleteUser(done) {
    User.findOneAndRemove({ email: 'fa@fa.com' }).then((doc) => {
      done();
    });
  });
});

describe('Generates jwt', function () {

  before(function create(done) {
    User.createUser({ email: 'fa@fa.com', password: 'bailando' })
      .then((doc) => {
        doc.genToken().then((token) => {
          done();
        });
      })
      .catch((err) => {
        throw err;
      });
  });

  it('generates jwt', function (done) {
    User.findOne({ email: 'fa@fa.com' })
      .then((doc) => {
        assert.equal(doc.tokens.length, 1);
        done();
      });
  });

  after(function deleteUser(done) {
    User.findOneAndRemove({ email: 'fa@fa.com' }).then((doc) => { done() });
  });

});

describe('Hashing password', function () {

  before(function create(done) {
    User.createUser({ email: 'fa@fa.com', password: 'bailando' })
      .then((doc) => {
        doc.genToken().then((token) => {
          done();
        });
      })
      .catch((err) => {
        throw err;
      });
  });

  it('hashed password', function (done) {
    User.findOne({ email: 'fa@fa.com' })
      .then((doc) => {
        bcrypt.compare('bailando', doc.password).then((res) => {
          if (res) {
            done();
          } else {
            throw new Error('Improperly hashed');
          }
        });
      });
  });

  after(function deleteUser(done) {
    User.findOneAndRemove({ email: 'fa@fa.com' }).then((doc) => { done() });
  });

});

describe('Logout', function () {

  before(function create(done) {
    User.createUser({ email: 'fa@fa.com', password: 'bailando' })
      .then((doc) => {
        doc.genToken().then((token) => {
          userToken = token;
          User.logout(token);
          setTimeout(done,500);
        });
      })
      .catch((err) => {
        throw err;
      });
  });

  it('should logout and delete token', function (done) {
    User.findOne({ email: 'fa@fa.com' })
      .then((doc) => {
        assert.equal(doc.tokens.length, 0);
        done();
      });
  });


  after(function deleteUser(done) {
    User.findOneAndRemove({ email: 'fa@fa.com' }).then((doc) => { done() });
  });

});