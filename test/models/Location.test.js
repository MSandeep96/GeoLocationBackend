var Location = require('../../models/Location');
var mongoose = require('../../config/mongo');
var expect = require('chai').expect;
var should = require('chai').should();
var assert = require('chai').assert;

before(function connectToDB(done) {
  if (mongoose.connection.readyState === 1) done();
  else
    mongoose.connection.on('connected', done);
});

describe('location', function () {
  before(function addLoc(done) {
    Location.add({
      user: {
        _id: '5a4dda093d107750685fb198'
      },
      longitude: 123.32,
      latitude: 345.34,
      timestamp: 1234232
    }).then(() => {
      done();
    });
  });

  it('should add a location', function (done) {
    Location.findOne({ userId: '5a4dda093d107750685fb198' })
      .then((res) => {
        should.exist(res, 'Failed to add location');
        done();
      });
  });

  it('should update location', function (done) {
    Location.add({
      user: {
        _id: '5a4dda093d107750685fb198'
      },
      longitude: 21.345,
      latitude: 234.234,
      timestamp: 2342342
    }).then(() => {
      Location.findOne({ userId: '5a4dda093d107750685fb198' }).then((doc) => {
        should.equal(doc.longitude, 21.345, 'Update failed');
        done();
      });
    });
  });

  after(function removeLoc(done) {
    Location.findOneAndRemove({ userId: '5a4dda093d107750685fb198' }).then((res) => {
      done();
    });
  });

});

describe('Fetch todos', function () {

  before(function addLoc(done) {
    Location.add({
      user: {
        _id: '5a4dda093d107750685fb198'
      },
      longitude: 123.32,
      latitude: 345.34,
      timestamp: 1234232
    }).then(() => {
      done();
    });
  });

  it('should fetch locations', function (done) {
    Location.fetch().then((res) => {
      should.equal(res.length, 1);
      done();
    });
  });

  it('should fetch location after time period',function(done){
    Location.fetch(12345).then((res)=>{
      should.equal(res.length,1);
      done();
    });
  });

  after(function removeLoc(done) {
    Location.findOneAndRemove({ userId: '5a4dda093d107750685fb198' }).then((res) => {
      done();
    });
  });

});