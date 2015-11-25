'use strict';

var gulp = require('gulp');

var paths = {
  lintFiles: [
    'gulpfile.js',
    'server/**/*.js',
  ],

  documentationFiles: [
    'README.md',
    'server/**/*.js',
    '!server/**/*.spec.js',
  ],

  sourceFiles: [
    'server/**/*.js',
    '!server/**/*.spec.js',
  ],

  testFiles: [
    'server/**/*.spec.js',
  ],
};

/*
 * Clean up build directories.
 */
gulp.task('clean', function() {
  var del = require('del');

  return del([
    'coverage/',
    'docs/',
  ]);
});

/*
 * Generator a Cobertura coverage report.
 * TODO
 */
gulp.task('test', ['clean'], function(done) {
  var istanbul = require('gulp-istanbul');
  var mocha    = require('gulp-mocha');

  gulp.src(paths.sourceFiles.concat(['!server/serve.js']))
    .pipe(istanbul({ includeUntested: true }))
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(paths.testFiles)
        .pipe(mocha({
          reporter: ['progress'],
        }))
        .pipe(istanbul.writeReports({
          reporters: ['text', 'lcov'],
        }))
        .on('end', done);
    });
});

/*
 * Run source files through JSCS style checks.
 */
gulp.task('jscs', function() {
  var jscs = require('gulp-jscs');

  return gulp.src(paths.lintFiles)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
  ;
});

/*
 * Generate source documentation.
 * TODO
 */
gulp.task('jsdoc', ['clean'], function() {
  var jsdoc = require('gulp-jsdoc');

  return gulp.src(paths.documentationFiles)
  .pipe(jsdoc(
    'docs/',
    {
      path: 'ink-docstrap',
    }
  ))
  ;
});

/*
 * Run source files through JSHint lint checks.
 */
gulp.task('jshint', function() {
  var jshint  = require('gulp-jshint');

  return gulp.src(paths.lintFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
  ;
});

/*
 * Watch for file changes to either source, or test, files, and execute the appropriate task(s) associated with the
 * changed file(s).
 * TODO
 */
gulp.task('serve', ['default'], function() {
  var watch = require('gulp-watch');

  watch(paths.lintFiles, function() {
    gulp.start('jshint');
    gulp.start('jscs');
  });

  watch(paths.templateFiles.concat(paths.sourceFiles).concat(paths.testFiles), function() {
    gulp.start('test:unit');
  });
});

gulp.task('default', ['jscs', 'jshint', 'test', 'jsdoc']);
