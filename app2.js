// routes.js
var fe = require('./fe')
var api = require('./api')

module.exports = {
  '/': fe.home,
  '/intervieweres': fe.interviewers,
  '/prospectives': fe.prospectives,
  '/admin': fe.admin,

  '/api': {
    '/availabilities': {GET: api.getAvailabilities, POST: api.addAvailability},
    '/interviews': {GET: api.getInterviews, POST: api.createInterview},
  }
}

var app = require('./app-init')

app.get('/', function home(res) {
  return 'Philo Interview Scheduler'
})

.get('/interviewers', function interviewers() {

})

.get('/prospectives', function prospectives() {

})

.get('/admin', authenticate, function admin() {

})
