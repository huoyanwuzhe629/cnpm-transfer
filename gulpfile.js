'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var rimraf = require('gulp-rimraf');
var map = require('map-stream');
var minifycss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin')

var DEST = 'dist/';

var exitOnJshintError = map(function (file, cb) {
  if (!file.jshint.success) {
    console.error('jshint failed! ');
    // process.exit(1);
  }
});

gulp.task('clean', ['hint'], function() {
	gulp.src('dist/*.js',{read:false})
		.pipe(rimraf());
});

gulp.task('hint', [], function(){
	var jshint = require('gulp-jshint');
    var stylish = require('jshint-stylish');

    gulp.src(['src/*.js'])
        .pipe(jshint('./.jshintrc'))
        .pipe(jshint.reporter(stylish))
        .pipe(exitOnJshintError);
});

gulp.task('compress', ['clean'], function() {
	gulp.src(['src/*.js'])
		.pipe(gulp.dest(DEST))
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest(DEST));
});

gulp.task('buildCss', function () {
  gulp.src(['src/css/**/*.css'])
    .pipe(gulp.dest(DEST))
    .pipe(minifycss())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest(DEST))
});

gulp.task('image', function () {
    gulp.src('src/img/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(DEST + 'img'))
});

gulp.task('default', ['hint','clean','compress', 'buildCss', 'image'], function() {});
