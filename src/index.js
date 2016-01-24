'use strict';

var _ = require('lodash');
var url = require('url');
var GitHubApi = require('github');
var parser = require('conventional-commits-parser');
var streamify = require('stream-array');
var through = require('through2');

module.exports = githubNotifier;

function githubNotifier(pluginConfig, config, callback) {
  var githubConfig = config.options.githubUrl ? url.parse(config.options.githubUrl) : {};

  var github = new GitHubApi({
    version: '3.0.0',
    port: githubConfig.port,
    protocol: (githubConfig.protocol || '').split(':')[0] || null,
    host: githubConfig.hostname,
  });

  if (config.options.debug) {
    return callback();
  }

  if (config.options.debug) {
    github.authenticate({
      type: 'oauth',
      token: config.options.githubToken,
    });
  }

  streamify(config.commits)
    .pipe(through.obj(function(commit, enc, cb) {
      cb(null, commit.message);
    }))
    .pipe(parser())
    .pipe(through.obj(function(commit, enc, cb) {

      _.forEach(commit.references, function(/*reference*/) {
        // post to github using reference.issue
      });

      cb();
    }))
    .on('end', function() {
      callback();
    });
}
