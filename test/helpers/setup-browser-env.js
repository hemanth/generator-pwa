global.document = require('jsdom').jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;
global.self = window.self; //Temp fix: should be service worker global scope
