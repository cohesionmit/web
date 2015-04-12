var mongoose = require('mongoose');

var logSchema = new mongoose.Schema({
  kind: {type: String, required: true},
  message: {type: String, required: true},
  time: {type: Date, default: Date.now}
});

var Log = mongoose.model('Log', logSchema);
module.exports = Log;
