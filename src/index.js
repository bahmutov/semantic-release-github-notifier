'use strict';

var url = require('url');
var GitHubApi = require('github');
var parser = require('conventional-commits-parser');
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
    github.authenticate({
      type: 'oauth',
      token: config.options.githubToken,
    });
  }

  parser()
    .pipe(through.obj(function(commit, enc, cb) {
      if (config.options.debug) {
        return callback();
      }

      // post to github.

      cb();
    }))
    .on('end', function() {
      callback();
    });
}
