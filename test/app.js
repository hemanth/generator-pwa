'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var prompts = {
  appName: 'test',
  isPush: true,
  apiKey: 123,
  gcmSenderId: 123
};

var options = {};

describe('generator-pwa:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
    .withOptions(options)
    .withPrompts(prompts)
    .on('end', done);
  });

  it('creates files', function () {
    assert.file('test/css test/css/styles.css test/favicon.ico test/images test/index.html test/js test/js/app.js test/manifest.json test/sw.js test/server.js'.split(' '));
  });
});
