var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  fburl: {type: String, unique: true, required: true},
  active: {type: Boolean, default: false, required: true},
  location: {type: [Number], default: [0.0, 0.0], index: '2d'},
  lastupdate: {type: Date, default: new Date(0), required: true},
  classes: [{name: String, status: {type: String, enum: ['TODO', 'STARTED', 'DONE']}}]
});

var User = mongoose.model('User', userSchema);
module.exports = User;
