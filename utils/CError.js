function genError(statusCode,message){
  var e = new Error(message);
  e.status = statusCode;
  return e;
}

module.exports = genError;