'use strict';

var _ = require('lodash');
var parser = require('conventional-commits-parser');
var streamify = require('stream-array');
var through = require('through2');

module.exports = commitParser;

function commitParser(commits) {
  return streamify(commits)
    .pipe(through.obj(function (commit, enc, cb) {
      cb(null, commit.message);
    }))
    .pipe(parser())
    .pipe(through.obj(function (commit, enc, cb) {

      _.forEach(commit.references, function (/*reference*/) {
        // post to github using reference.issue
      });

      cb();
    }))

    //.on('end', function() {
    //  callback();
    //})
  ;
}
