import mongoose from 'mongoose'

var locationSchema = new mongoose.Schema({
  userId: String,
  latitude: Number,
  longitude: Number,
  time: Date
});

class LocationClass{

}

locationSchema.loadClass(LocationClass);

var Location = mongoose.model('Location',locationSchema);

module.exports = Location;