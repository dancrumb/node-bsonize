'use strict';

var gulp = require('gulp');
var mdox = require('gulp-mdox');
var mocha = require('gulp-mocha');

gulp.task('test', function () {
  return gulp
    .src('test/**/*.spec.js', { read: false })
    .pipe(mocha({ reporter: 'dot' }));
});

gulp.task('document', function () {
  return gulp
    .src('lib/**/*.js')
    .pipe(mdox({
      src: "README.md",
      name: "README.md",
      start: "## API documentation",
      end: "## License"
    }))
    .pipe(gulp.dest('.'));
});
