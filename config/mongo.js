//Set up connection with db
var mongoose = require('mongoose');
mongoose.connect('mongodb://sande96:sande96@ds235877.mlab.com:35877/proper');
mongoose.Promise = global.Promise;
mongoose.connection.on('open',()=>{
  console.log("Db connected");
});
module.exports = mongoose;