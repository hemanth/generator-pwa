'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-pwa:app', function () {
    before(function (done) {
        helpers.run(path.join(__dirname, '../generators/app'))
          .withOptions({ apiKey: 123 })
          .withPrompts({ isPush: true, gcmSenderId:false })
          .on('end', done);
    });

    it('creates files', function () {
        assert.file('app/css favicon images index.html js manifest.json sw-cache-polyfill.js sw.js'.split(' '));
    });
});
