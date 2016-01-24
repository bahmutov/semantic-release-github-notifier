'use strict';

var url = require('url');
var GitHubApi = require('github');

var commitsParser = require('./commit-parser');

module.exports = githubNotifier;

function githubNotifier(pluginConfig, config, callback) {
  if (config.options.debug) {
    return callback();
  }

  var githubConfig = config.options.githubUrl ? url.parse(config.options.githubUrl) : {};

  var github = new GitHubApi({
    version: '3.0.0',
    port: githubConfig.port,
    protocol: (githubConfig.protocol || '').split(':')[0] || null,
    host: githubConfig.hostname,
  });

  github.authenticate({
    type: 'oauth',
    token: config.options.githubToken,
  });

  commitsParser(config.commits);
}
