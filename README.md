# generator-pwa [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]
> Progressive Webapp generator

## Installation

```bash
npm install -g yo
npm install -g generator-pwa
```

Then generate your new project:

```bash
yo pwa
```

This would generate a dir structure like:

```sh
app/
|____css
| |____style.css
|____favicon.ico
|____images
| |____touch
| | |____apple-touch-icon.png
| | |____chrome-touch-icon-192x192.png
| | |____icon-128x128.png
| | |____ms-touch-icon-144x144-precomposed.png
|____index.html
|____js
| |____app.js
| |____push.js
|____server.js
|____sw.js
```

## Run

```bash
  gulp
```

*For push notification*

```bash
  npm start
```

##TODO

- [ ] - Prompt for all `manifest.json` related fields.

- [ ] - AskFor static-cache-path (automatically pick the required files).

- [x] - Use `serviceworker-cache-polyfill` from npm instead.

- [ ] - Use `async-await` in `sw.js`.

- [x] - Add simple push notification.

- [x] - Prompt for GCM api keys.

- [ ] - Add background sync.

- [x] - Work on a build system, `npm-script` or `gulp`.

- [ ] - Add a gif!


## License

MIT © [Hemanth.HM](https://h3manth.com)


[npm-image]: https://badge.fury.io/js/generator-pwa.svg
[npm-url]: https://npmjs.org/package/generator-pwa
[travis-image]: https://travis-ci.org/hemanth/generator-pwa.svg?branch=master
[travis-url]: https://travis-ci.org/hemanth/generator-pwa
