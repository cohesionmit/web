var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');

var util = require('../util');
var User = require('../models/user');
var Log = require('../models/log');

/* GET status page */
router.get('/', function(req, res, next) {
  // show database contents
  User.find({}, function(err, users) {
    Log.create({kind: 'response', message: '<contents of db omitted>'});
    res.send(users);
  });
});

/*****************************************
 * AUTH
 *****************************************/

/* POST to register */
router.post('/register', function(req, res) {
  var first = req.body.firstname;
  var last = req.body.lastname;
  var fburl = req.body.fburl;
  User.create({firstname: first, lastname: last, fburl: fburl}, util.lift(res, function(user) {
    res.status(200);
    Log.create({kind: 'response', message: JSON.stringify({success: true})});
    res.send({success: true});
  }));
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
      Log.create({kind: 'response', message: JSON.stringify({near: limited})});
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
      Log.create({kind: 'response', message: JSON.stringify({success: true})});
    }));
  }));
});

/* POST to get classes */
router.post('/getclasses', function(req, res) {
  User.findOne({fburl: req.body.fburl}, util.lift(res, function(user) {
    res.status(200);
    res.send({classes: user.classes});
    Log.create({kind: 'response', message: JSON.stringify({classes: user.classes})});
  }));
});

/* POST to update classes */
router.post('/setclasses', function(req, res) {
  User.findOne({fburl: req.body.fburl}, util.lift(res, function(user) {
    user.classes = req.body.classes;
    user.save(util.lift(res, function() {
      res.status(200);
      res.send({success: true});
      Log.create({kind: 'response', message: JSON.stringify({success: true})});
    }));
  }));
});

/*****************************************
 * OTHER
 *****************************************/

/* POST feeddback */

router.post('/feedback', function(req, res) {
  var user = req.body.fburl;
  var message = req.body.message;
  Log.create({kind: 'feedback', message: JSON.stringify({user: user, message: message})}, util.lift(res, function(log) {
    res.status(200);
    res.send({success: true});
  }));
});

/* GET an easter egg */
router.get('/easteregg', function(req, res) {
  res.status(200);
  hard = ["Names","Ideas","Notecards","Capitalization","Group Work / Group-Work / Groupwork","Replying All","Meetings","Scheduling","Mobile Data","Folders","Tabs","2G","Adding Things to Lists","Android","Web","Emails","Jokes","Authentication","Life","NP/PSPACE/EXPTIME","Ordering Food","Libraries","Sleep","Guest Lists","Communication","Layouts","Week of 4/6/15"];
  res.send({success: true, "fun":hard[Math.floor(Math.random()*hard.length)]+" is Hard"});
  Log.create({kind: 'response', message: '<easter egg omitted>'});
});

module.exports = router;
