'use strict';

var chai = require('chai');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);
var expect = chai.expect;

function githubMock() {
}

githubMock.prototype.authenticate = sinon.spy();

describe('semantic-release-github-notifier', function() {
  var options;
  var plugin;

  before(function() {
    plugin = proxyquire('./index', { github: githubMock });
  });

  beforeEach(function() {
    options = {
      debug: true,
      githubToken: 'TOKEN',
      githubUrl: 'https://www.github.com:80',
    };

  });

  describe('debug mode', function() {

    it('parses GitHub URL', function() {
      var callback = sinon.spy();
      plugin({}, { options: options }, callback);

      expect(callback).to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(null);
    });

    it('falls back on default GitHub URL', function() {
      var callback = sinon.spy();
      options.githubUrl = undefined;
      plugin({}, { options: options }, callback);

      expect(callback).to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(null);
    });
  });
});
