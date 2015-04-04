var express = require('express');
var router = express.Router();

var Users = require('../models/user.js');

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
  // this doesn't actually do anything
  res.send({status: 'ok'});
});

/* POST to register */
router.post('/register', function(req, res) {
  // TODO
});

/*****************************************
 * ACCOUNT
 *****************************************/

/* PUT to change profile */
router.post('/profile', function(req, res) {
  // can update username, real name
  // TODO
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
  // TODO
});

/* GET classes */
router.post('/classes', function(req, res) {
  // TODO
});

/* POST to update classes */
router.post('/classes', function(req, res) {
  // TODO
});

/*****************************************
 * OTHER
 *****************************************/

/* GET an easter egg */
router.get('/easteregg', function(req, res) {
  // TODO
});

module.exports = router;
