/**
 * @fileoverview Database interfaces
 */
var _         = require('lodash')
var mongoose  = require('mongoose')
var config    = require('./config')
var constants = require('./constants')

mongoose.connect(config.MONGO_URL)

var HalfHourSchema = new mongoose.Schema({
  at: {type: Date, index: true, unique: true},
  user: {
    name:  {type: String, required: true},
    email: {type: String, required: true},
    type:  {type: String, required: true, enum: _.values(constants.USER_TYPE)},
  },
}, {autoIndex: config.DEBUG})

module.exports = {
  conn:     mongoose.connection,
  HalfHour: mongoose.model('HalfHour', HalfHourSchema),
}
