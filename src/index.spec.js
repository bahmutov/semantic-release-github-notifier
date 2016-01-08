'use strict';

var plugin = require('./index');

var expect = require('chai').expect;

describe('semantic-release-github-notifier', function() {

  it('should be a function', function() {
    expect(plugin).to.be.a('function');
  });
});
