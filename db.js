/**
 * Database interfaces
 */
var mongoose = require('mongoose')
var config = require('./config')


mongoose.connect(config.MONGO_URL)

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  type: {type: String, enum: ['interviewer', 'baby', 'prospective']}
})

var HalfHourSchema = new mongoose.Schema({
  at: {type: Date, index: true},
  user: UserSchema,
})

module.exports = {
  conn: mongoose.connection,
  HalfHour: mongoose.model('HalfHour', HalfHourSchema),
}
