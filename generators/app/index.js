'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the peachy ' + chalk.red('Progresssive Web App') + ' generator!'
    ));

    done();

    // No prompts as of now.
    // var prompts = [{
    //   type: 'confirm',
    //   name: 'someOption',
    //   message: 'Would you like to enable this option?',
    //   default: true
    // }];

    // this.prompt(prompts, function (props) {
    //   this.props = props;
    //   // To access props later use this.props.someOption;

    //   done();
    // }.bind(this));
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('css'),
      this.destinationPath('css')
    );
    this.fs.copy(
      this.templatePath('images'),
      this.destinationPath('images')
    );
    this.fs.copy(
      this.templatePath('js'),
      this.destinationPath('js')
    );
    this.fs.copy(
      this.templatePath('favicon.ico'),
      this.destinationPath('favicon')
    );
    this.fs.copy(
      this.templatePath('index.html'),
      this.destinationPath('index.html')
    );
    this.fs.copy(
      this.templatePath('sw.js'),
      this.destinationPath('sw.js')
    );
    this.fs.copy(
      this.templatePath('sw-cache-polyfill.js'),
      this.destinationPath('sw-cache-polyfill.js')
    );
    this.fs.copy(
      this.templatePath('manifest.json'),
      this.destinationPath('manifest.json')
    );
    this.fs.copy(
      this.templatePath('package.json'),
      this.destinationPath('package.json')
    );
    this.fs.copy(
      this.templatePath('server.js'),
      this.destinationPath('server.js')
    );
  },

  install: function () {
    this.installDependencies();
  }
});
