var Location = require('../../models/Location');
var data = require('./Location.json');

function addStuff(){
  Location.collection.insert(data,(err,docs)=>{
    if(!err){
      console.log('done');
    }
  });
}

addStuff();