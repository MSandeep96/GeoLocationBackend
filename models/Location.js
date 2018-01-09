var Schema = require('mongoose').Schema;
var mongoose = require('../config/mongo');
var pick = require('lodash.pick');
/**
 * Location objects have a TTL of 3 hrs
 */
var locationSchema = new mongoose.Schema({
  userId: Schema.Types.ObjectId,
  latitude: Number,
  longitude: Number,
  timestamp: Date
});

class LocationClass {

  static add(obj) {
    obj.userId = obj.user._id;
    delete obj.user;
    return Location.update({ userId: obj.userId }, obj, { upsert: true })
      .then((rawRes) => {
        return Promise.resolve();
      });
  }

  static fetch(afterTime) {
    let queryObj = {};
    if (afterTime) {
      queryObj = {
        timestamp: { $gt: afterTime }
      }
    }
    return Location.find(queryObj);
  }
}

locationSchema.methods.toJSON = function () {
  var location = this.toObject();
  return pick(location, ['userId', 'longitude', 'latitude', 'timestamp']);
}

locationSchema.loadClass(LocationClass);

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;