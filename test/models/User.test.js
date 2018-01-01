var User = require('../../models/User');
var mongoose = require('../../config/mongo');
var expect = require('chai').expect;
var should = require('chai').should();

describe('User Schema', function () {

  before(function connectToDB(done) {
    mongoose.connection.once('open', done);
  });

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

  before(function connectToDB(done) {
    mongoose.connection.once('open', done);
  });

  beforeEach(function createUser(done) {
    User.createUser({ email: 'fa@fa.com', password: 'bailando' })
      .then((doc) => {
        done();
      })
      .catch((err) => {
        throw new Error(err);
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

  afterEach(function deleteUser(done) {
    User.findOneAndRemove({ email: 'fa@fa.com' }).then((doc) => {
      done();
    });
  });

});

describe('#loginUser()', function () {

  before(function connectToDB(done) {
    mongoose.connection.once('open', done);
  });

  before(function create() {
    User.createUser({ email: 'fa@fa.com', password: 'bailando' })
      .then((doc) => {
        done();
      })
      .catch((err) => {
        throw new Error(err);
      });
  });

  it('should login the user', function () {
    User.login({ email: 'fa@fa.com', password: 'bailando' })
      .then((doc) => {
        done();
      })
      .catch((err) => {
        throw new Error(err);
      });
  });

  it('should fail as invalid password', function () {
    User.login({ email: 'fa@fa.com', password: 'baila' })
      .then((doc) => {
        throw new Error();
      })
      .catch((err) => {
        done();
      });
  });

  it('should fail as no such user', function () {
    User.login({ email: 'everydfj', password: 'baila' })
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

