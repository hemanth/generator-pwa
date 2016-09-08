'use strict';

import path from 'path';
import test from 'ava';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import pify from 'pify';

let generator;

test.beforeEach(async () => {

  await pify(helpers.testDirectory)(path.join(__dirname, 'temp'));
  generator = helpers.createGenerator('pwa', ['../../generators/app/'], null, {skipInstall: true});
});

test.serial('generates expected files', async () => {
  helpers.mockPrompt(generator, {
    appName: 'test',
    isPush: false,
  });

  await pify(generator.run.bind(generator))();

  assert.file('test/css test/css/styles.css test/favicon.ico test/images test/index.html test/js test/js/app.js test/manifest.json test/serviceWorker.js test/server.js'.split(' '));
});
