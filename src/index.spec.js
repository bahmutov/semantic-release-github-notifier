'use strict';

var plugin = require('./index');

var expect = require('chai').expect;

describe('semantic-release-github-notifier', function() {

  it('should be a function', function() {
    expect(plugin).to.be.a('function');
  });

  it('should return an error if directory is not a git repo', function(done) {
    var tmp = require('tmp');

    var currentDirectory = process.cwd();
    tmp.dir(function(err, path) {
      process.chdir(path);

      plugin({}, { options: { githubUrl: 'test/example' } }, function(err) {
        expect(err).to.be.defined;
        process.chdir(currentDirectory);
        done();
      });
    });
  });
});
