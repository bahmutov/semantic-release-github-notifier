'use strict';

module.exports = githubNotifier;

var url = require('url');
var gitHead = require('git-head');
var GitHubApi = require('github');
var parseGitHubUrl = require('parse-github-repo-url');

function githubNotifier(pluginConfig, config, callback) {
  var ghUrl = config.options.githubUrl ? url.parse(config.options.githubUrl) : {};

  gitHead(function(err, hash) {
    if (err) {
      return callback(err);
    }

    var ghRepo = parseGitHubUrl(config.pkg.repository.url);

    // jscs:disable
    var release = {
      owner: ghRepo[0],
      repo: ghRepo[1],
      name: 'v${pkg.version}',
      'tag_name': 'v${pkg.version}',
      'target_commitish': hash,
      draft: !!config.options.debug,
      body: config.releaseNotes.log,
    };

    // jscs:enable

    if (config.options.debug && !config.options.githubToken) {
      return callback(null, false, release);
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

    github.releases.createRelease(release, function(err) {
      if (err) {
        return callback(err);
      }

      callback(null, true, release);
    });
  });
}
