var gulp    = require('gulp')
var jshint  = require('gulp-jshint')
var stylish = require('jshint-stylish')

var SRC = ['./src/*.js']

gulp.task('lint', function () {
  return gulp.src(SRC)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
})

gulp.task('watch', function () {
  gulp.watch(SRC, ['lint'])
})

gulp.task('default', ['lint', 'watch'])
