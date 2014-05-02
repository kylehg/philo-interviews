/**
 * @fileoverview The API endpoints
 */
var express = require('express')
var rsvp    = require('rsvp')
var db      = require('./db')


var HTTP_OK          = 200
var HTTP_CREATED     = 201
var HTTP_BAD_REQUEST = 400

/** Create a function to handle JSON API responses */
function makeApiResponder(req, res) {
  return function sendApiResponse(resultOrErrMsg, opt_statusCode) {
    var result, err

    // If the status code is an error (non-200), set the `error` field,
    // otherwise set the `data`
    var statusCode = opt_statusCode || HTTP_OK
    if (2 === (statusCode / 100) | 0) { // Do integer division
      result = resultOrErrMsg
    } else {
      err = resultOrErrMsg
    }

    res.send(statusCode, {
      data:    result || null,
      error:   err || null,
      request: 'GET' == req.method.toUpperCase() ? req.query : req.body
    })
  }
}


var apiRouter = express.Router()

// The availability resource
apiRouter.route('/availability')

  /** Get the availabilities in a range of dates */
  .get(function getAvailabilities(req, res) {
    var respond = makeApiResponder(req, res)

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
      .then(respond, function (err) {
        respond(err.message, 500)
        console.error(err.stack)
      })
  })

  /** Set the availability for a user */
  .post(function addAvailability(req, res) {
    var respond = makeApiResponder(req, res)

    var user         = req.body.user
    var availability = req.body.availability || []

    if (!(user && user.name && user.email && user.type)) {
      respond('Invalid user object', HTTP_BAD_REQUEST)
    }

    rsvp.all(availability.map(function (block) {
      var datetime = new Date(block)
      if (isNaN(datetime)) {
        respond('Invalid availability block provided: ' + datetime, HTTP_BAD_REQUEST)
      }

      var halfHour = new db.HalfHour({user: user, at: datetime})
      return rsvp.denodeify(halfHour.save)()
    })).then(function (halfHours) {
      respond({success: true, blocksAdded: halfHours.length}, HTTP_CREATED)
    }, function (err) {
      respond(err.message, 500)
      console.error(err.stack)
    })
  })


module.exports = apiRouter
