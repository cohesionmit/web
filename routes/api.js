var express = require('express');
var router = express.Router();

var util = require('../util')
var User = require('../models/user');

/* GET status page */
router.get('/', function(req, res, next) {
  res.send({status: 'ok'});
});

/*****************************************
 * AUTH
 *****************************************/

/* POST to log in */
router.post('/login', function(req, res) {
  // just kidding, you don't need to log in
  // just submit the username along with all other requests
  res.send({status: 'ok'});
});

/* POST to log out */
router.post('/logout', function(req, res) {
  // this doesn't actually need to do anything
  res.send({status: 'ok'});
});

/* POST to register */
router.post('/register', function(req, res) {
  var first = req.body.firstname;
  var last = req.body.lastname;
  var fburl = req.body.fburl;
  User.create({firstname: first, lastname: last, fburl: fburl}, util.lift(res, function(user) {
    res.status(200);
    res.send({success: true});
  }));
});

/*****************************************
 * ACCOUNT
 *****************************************/

/* PUT to change profile */
router.post('/profile', function(req, res) {
  // can update username, real name
  // we never actually need to do this
});

/*****************************************
 * RPCs
 *****************************************/

/* GET to find people nearby */
router.post('/near', function(req, res) {
  // TODO
});

/* POST to update location */
router.post('/location', function(req, res) {
  User.findOne({fburl: req.body.fburl}, util.lift(res, function(user) {
    user.location.longitude = req.body.longitude;
    user.location.latitude = req.body.latitude;
    user.save(util.lift(res, function() {
      res.status(200);
      res.send({success: true});
    }));
  }));
});

/* GET classes */
router.get('/classes', function(req, res) {
  User.findOne({fburl: req.body.fburl}, util.lift(res, function(user) {
    res.status(200);
    res.send(user.classes);
  }));
});

/* POST to update classes */
router.post('/classes', function(req, res) {
  User.findOne({fburl: req.body.fburl}, util.lift(res, function(user) {
    user.classes = req.body.classes;
    user.save(util.lift(res, function() {
      res.status(200);
      res.send({success: true});
    }));
  }));
});

/*****************************************
 * OTHER
 *****************************************/

/* GET an easter egg */
router.get('/easteregg', function(req, res) {
  res.status(200);
  res.send({success: true});
});

module.exports = router;
