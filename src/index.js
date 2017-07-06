'use strict';

var _ = require('lodash');
var bluebird = require('bluebird');
var url = require('url');
var GitHubApi = require('github');
var through = require('through2');
var parseGithubUrl = require('parse-github-repo-url');
var commitParser = require('./commit-parser');
var debug = require('debug')('notifier');
const ggit = require('ggit')
const simpleCommitMessage = require('simple-commit-message')
const newCommits = require('new-public-commits').newPublicCommits

module.exports = githubNotifier;

// function githubNotifier(pluginConfig, config, callback) {
function githubNotifier(pluginConfig, config, callback) {
  debug('plugin config', pluginConfig)
  debug('pkg', config.pkg)
  // return callback()
  newCommits()
    .then(function (commits) {
      debug('have %d semantic commits', commits.length)
      if (!commits.length) {
        return callback()
      }

        var parsedGithubUrl = parseGithubUrl(config.pkg.repository.url);
        commitParser(commits)
          .pipe(through.obj(function (commit, enc, cb) {
            debug('notifying for commit %j', commit);
            var commentPromises = _.map(commit.references, function (reference) {
              debug('commit involves issue reference %j', reference);
              var msg = {
                user: parsedGithubUrl[0],
                repo: parsedGithubUrl[1],
                number: reference.issue,
                message: 'Version ' + config.pkg.version + ' has been published.',
              };

              // return createComment(msg);
              return bluebird.resolve()
            });

            bluebird.all(commentPromises)
              .then(function () {
                debug('all done')
                cb(null, commit);
              })
              .catch(function (err) {
                cb(err);
              });
          }))
          .on('error', function () {
            callback(false);
          })
          .on('finish', function () {
            callback(true);
          });
    })

  // var githubConfig = config.options.githubUrl ? url.parse(config.options.githubUrl) : {};

  // var github = new GitHubApi({
  //   version: '3.0.0',
  //   port: githubConfig.port,
  //   protocol: (githubConfig.protocol || '').split(':')[0] || null,
  //   host: githubConfig.hostname,
  // });

  // github.authenticate({
  //   type: 'oauth',
  //   token: config.options.githubToken,
  // });

  // // Placed at the end so that all GitHub code has had a chance to be invoked, including sanity
  // // checking for required input, like a GitHub token.
  // if (config.options.debug) {
  //   return callback(null);
  // }

  // var createComment = bluebird.promisify(github.issues.createComment);

  debug('parsing repo url %s', config.pkg.repository.url);
  debug('for published version %s', config.pkg.version);
}
