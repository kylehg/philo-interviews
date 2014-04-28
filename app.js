/**
 * Main application entry point
 */
var express  = require('express')
var http     = require('http')
var path     = require('path')

var config = require('./config')
var db     = require('./db')

// Config
var app = express()

app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(express.cookieParser(config.SECRET))
app.use(express.session())
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')))
if ('development' == app.get('env')) app.use(express.errorHandler()) // dev only


app.get('/', function home(req, res) {
  res.send('Philo interview scheduler')
})

app.get('/interviewers', function interviewers(req, res) {
  res.render('availability-form', {interviewer: true})
})

app.get('/prospectives', function prospectives(req, res) {
  res.render('availability-form', {interviewer: false})
})

var basicAuth = express.basicAuth(config.ADMIN_USERNAME, config.ADMIN_PASS)
app.get('/admin', basicAuth, function admin(req, res) {
  res.render('admin')
})

app.route('/api/availabilities')
  .get(function getAvailabilities(req, res) {
    db.HalfHour.find()
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
    res.render('availability')
  })


// Main
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
