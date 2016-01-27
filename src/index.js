'use strict';

var url = require('url');
var GitHubApi = require('github');

module.exports = githubNotifier;

function githubNotifier(pluginConfig, config, callback) {
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

  // Placed at the end so that all GitHub code has had a chance to be invoked, including sanity
  // checking for required input, like a GitHub token.
  if (config.options.debug) {
    return callback(null);
  }

  return callback();
}
