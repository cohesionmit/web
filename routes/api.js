var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');

var util = require('../util');
var User = require('../models/user');

/* GET status page */
router.get('/', function(req, res, next) {
  // show database contents
  User.find({}, function(err, users) {
    res.send(users);
  });
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
router.put('/profile', function(req, res) {
  // can update username, real name
  // we never actually need to do this
});

/*****************************************
 * RPCs
 *****************************************/

/* POST to find people nearby */
router.post('/near', function(req, res) {
  User.findOne({fburl: req.body.fburl}, util.lift(res, function(user) {
    User.geoNear(user.location, {
      spherical : true,  // tell mongo the earth is round, so it calculates based on a
                         // spherical location system
      distanceMultiplier: 6371 // tell mongo how many radians go into one kilometer.
    }, util.lift(res, function(users) {
      var withDistance = _.map(users, function(elem) {
        var obj = util.copy(elem.obj);
        obj.distance = elem.dis;
        return obj;
      });
      var filtered = _.filter(withDistance, function(elem) {
        // check to see if user is self
        if (elem.fburl === user.fburl) {
          return false;
        }
        // check to see if too old
        var now = new Date();
        if (now - new Date(elem.lastupdate) > 20 * 60 * 1000) {
          return false;
        }
        // check to see if classes in common
        for (var i = 0; i < elem.classes.length; i++) {
          for (var j = 0; j < user.classes.length; j++) {
            if (elem.classes[i].name === user.classes[j].name) {
              if (elem.classes[i].status !== 'DONE' && user.classes[j].status !== 'DONE') {
                return true;
              }
            }
          }
        }
        return false;
      });
      var hidden = _.map(filtered, function(elem) {
        var maskedClasses = [];
        for (var i = 0; i < elem.classes.length; i++) {
          for (var j = 0; j < user.classes.length; j++) {
            if (elem.classes[i].name == user.classes[j].name) {
              maskedClasses.push(elem.classes[i]);
              continue;
            }
          }
        }
        var obj = util.copy(elem);
        obj.classes = maskedClasses;
        return obj;
      });
      var limited = hidden.slice(0, req.body.limit || 10);
      res.status(200);
      res.send({near: limited});
    }));
  }));
});

/* POST to update location */
router.post('/location', function(req, res) {
  User.findOne({fburl: req.body.fburl}, util.lift(res, function(user) {
    user.location = [req.body.longitude, req.body.latitude];
    user.lastupdate = new Date();
    user.save(util.lift(res, function() {
      res.status(200);
      res.send({success: true});
    }));
  }));
});

/* POST to get classes */
router.post('/getclasses', function(req, res) {
  User.findOne({fburl: req.body.fburl}, util.lift(res, function(user) {
    res.status(200);
    res.send(user.classes);
  }));
});

/* POST to update classes */
router.post('/setclasses', function(req, res) {
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
  hard = ["Names","Ideas","Notecards","Capitalization","Group Work / Group-Work / Groupwork","Replying All","Meetings","Scheduling","Mobile Data","Folders","Tabs","2G","Adding Things to Lists","Android","Web","Emails","Jokes","Authentication","Life","NP/PSPACE/EXPTIME","Ordering Food","Libraries","Sleep","Guest Lists","Communication","Layouts","Week of 4/6/15"];
  res.send({success: true, "fun":hard[Math.floor(Math.random()*hard.length)]+" is Hard"});
});

module.exports = router;
