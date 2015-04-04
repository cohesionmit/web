var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  active: Boolean,
  latitude: Number,
  longitude: Number,
  classes: [{name: String, status: {type: String, enum: ['TODO', 'STARTED', 'DONE']}}]
});

var User = mongoose.model('User', userSchema);
module.exports = User;
