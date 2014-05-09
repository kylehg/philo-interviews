/**
 * @fileoverview The API endpoints
 */
var express   = require('express')
var _         = require('lodash')
var rsvp      = require('rsvp')
var constants = require('./constants')
var db        = require('./db')

var ERR  = constants.ERR_MSGS
var HTTP = constants.HTTP

/** Create a function to handle JSON API responses */
function makeApiResponder(req, res) {

  /** Given some data and an optional HTTP status code, send an API response */
  function apiRespond(resultOrErrMsg, opt_statusCode) {
    var result, err

    // If the status code is an error (non-200), set the `error` field,
    // otherwise set `data`
    var statusCode = opt_statusCode || HTTP.OK
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

  /** Given a JavaScript Error object, send a generic server error */
  apiRespond.err = function (err) {
    apiRespond(err.message, HTTP.SERVER_ERR)
    console.error(err.stack)
  }

  return apiRespond
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
      respond(ERR.INVALID_DATE, HTTP.BAD_REQUEST)
    }

    // Lookup availabilities in range
    db.HalfHour.find({at: {$gte: fromDate, $lte: toDate}}).exec()
    .then(function (blocks) {
      var coalatedBlocks = _.chain(blocks)
        .sortBy('at')
        .groupBy('at')
        .valueOf()
        .map(function (blockArr) {
          return {at: blockArr[0].at, users: _.pluck(blockArr, 'user')}
        })

        respond(coalatedBlocks)
    }, respond.err)
  })

  /** Set the availability for a user */
  .post(function addAvailability(req, res) {
    var respond = makeApiResponder(req, res)

    var user         = req.body.user
    var availability = req.body.availability || []

    if (!(user && user.name && user.email && user.type)) {
      respond(ERR.INVALID_USER, HTTP.BAD_REQUEST)
    }

    var blocks = availability.map(function (block) {
      var datetime = new Date(block)
      if (isNaN(datetime)) {
        respond(ERR.INVALID_BLOCK + ': ' + datetime, HTTP.BAD_REQUEST)
      }

      var halfHour = new db.HalfHour({user: user, at: datetime})
      return rsvp.denodeify(halfHour.save)()
    })
    rsvp.all(blocks).then(function (blocks) {
      respond({success: true, blocksAdded: blocks.length}, HTTP.CREATED)
    }, respond.err)
  })


module.exports = apiRouter
