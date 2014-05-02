var express = require('express')
var rsvp    = require('rsvp')

var db = require('./db')


var HTTP_BAD_REQUEST = 400

var api = express.Router()


function apiResponse(req, res) {
  return function (resultOrErrMsg, responseCode) {
    var result = null
    var err = null

    responseCode = responseCode || 200
    if (2 === (responseCode / 100) | 0) {
      err = resultOrErrMsg
    } else {
      result = resultOrErrMsg
    }

    res.send(responseCode, {result: result, error: err})
  }
}


api.route('/availability')

  .get(function getAvailabilities(req, res) {
    var respond = apiResponse(req, res)

    var fromParam = req.query.from
    var toParam   = req.query.to

    // Validate input
    var fromDate = new Date(formParam)
    var toDate   = toParam ? new Date(toParam) : new Date()
    if (isNaN(fromDate) || isNaN(toDate)) {
      respond('Invalid date params: "' + fromParam + '", "' + toParam + '"', HTTP_BAD_REQUEST)
    }

    // Lookup availabilities in range
    db.HalfHour.find({at: {$gte: fromDate, $lte: toDate}}).exec()
      .then(respond)
      .catch(function (err) {
        respond(err.message, 500)
        console.error(err.stack)
      })
  })

  .post(function addAvailability(req, res) {
    var respond = apiResponse(req, res)

    var user         = req.body.user
    var availability = req.body.availability || []

    if (!(user && user.name && user.email && user.type)) {
      respond('Invalid user: ' + user, HTTP_BAD_REQUEST)
    }

    rsvp.all(availability.map(function (block) {
      var datetime = new Date(block)
      if (isNaN(datetime)) {
        respond('Invalid availability block provided: ' + datetime, HTTP_BAD_REQUEST)
      }

      var halfHour = new db.HalfHour({user: user, at: datetime})
      return rsvp.denodeify(halfHour.save)()
    }).then(function (halfHours) {
      respond({success: true, blocksAdded: halfHours.length}, 201)
    }).catch(function (err) {
      respond(err.message, 500)
      console.error(err.stack)
    })
  })


module.exports = api
