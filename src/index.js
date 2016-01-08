'use strict';

var url = require('url');
var GitHubApi = require('github');

module.exports = githubNotifier;

function githubNotifier(pluginConfig, config, callback) {
  var ghUrl = config.options.githubUrl ? url.parse(config.options.githubUrl) : {};

  if (config.options.debug && !config.options.githubToken) {
    return callback(null);
  }

  var github = new GitHubApi({
    port: ghUrl.port,
    protocol: (ghUrl.protocol || '').split(':')[0] || null,
    host: ghUrl.hostname,
  });

  github.authenticate({
    type: 'oauth',
    token: config.options.githubToken,
  });

  callback(null);
}
