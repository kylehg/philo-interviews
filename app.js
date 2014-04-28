var express      = require('express')
var path         = require('path')
var favicon      = require('static-favicon')
var logger       = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser   = require('body-parser')

var config = require('./config')


var app = express()

// Config
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(favicon())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', function home(req, res) {
  res.send('Philo interview scheduler')
})


app.get('/interviewers', function interviewers(req, res) {
  res.render('availability-form', {interviewer: true})
})


app.get('/prospectives', function prospectives(req, res) {
  res.render('availability-form', {interviewer: false})
})


app.get('/admin', function admin(req, res) {
  res.render('admin')
})


app.route('/api/availabilities')
  .get(function getAvailabilities(req, res) {
    // db.HalfHour.find()
    var availabilities = [
      {date: '2014-03-05',
       blocks: [
         {start:         '0900',
          end:           '1330',
          userId:        '52e2c8c387f163948868504d',
          isProspective: true}]}]
    res.send(availabilities)
  })
  .post(function addAvailability(req, res) {
    res.send('availability')
  })


// Catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})


// Error handlers

// Development error handler, will print stacktrace
if (app.get('env') == 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// Production error handler, no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
