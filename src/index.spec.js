'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);
var expect = chai.expect;

var plugin = require('./index');

describe('semantic-release-github-notifier', function() {

  it('does nothing while running in debug mode', function() {
    var callback = sinon.spy();
    plugin({}, { options: { debug: true } }, callback);

    expect(callback).to.have.been.calledOnce
      .and.to.have.been.calledWithExactly();
  });

  it('parses GitHub URL', function() {
    var callback = sinon.spy();
    plugin({}, { options: { debug: true, githubUrl: 'https://www.github.com:80' } }, callback);

    expect(callback).to.have.been.calledOnce
      .and.to.have.been.calledWithExactly();
  });
});
