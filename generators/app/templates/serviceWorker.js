var CACHE_NAME = 'sw-ex';
var CACHE_VERSION = 1;

var files = [
  '/',
  '/index.html',
  '/index.html?utm=homescreen',
  '/css/styles.css',
  '/js/app.js',
  <%if(isPush){%>'/js/push.js',<%}%>
  <%if(isBGsync){%>'/js/sync.js',<%}%>
  '/images/yeoman.png',
  '/images/touch/chrome-touch-icon-192x192.png',
  '/manifest.json'
];

//Adding `install` event listener
self.addEventListener('install', function(event) {
  console.info('Event: Install');

  event.waitUntil(
    caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(function(cache) {
      return cache.addAll(files)
        .then(function () {
          console.info('All files are cached.');
          return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
        })
        .catch(function (error) {
          console.error('Failed to cache ', error);
        })
    })
  );
});

//Adding `activate` event listener
self.addEventListener('activate', function(event) {
  console.info('Event: Activate');

  //Active `service worker` to set itself as the active on current and all other active clients.
  return self.clients.claim();
});

//Adding `fetch` event listener
self.addEventListener('fetch', function(event) {
  console.info('Event: Fetch');

  var request = event.request;

  //Tell the browser to wait for newtwork request and respond with below
  event.respondWith(
    //If request is already in cache, return it
    caches.match(request).then(function(response) {
      if (response) {
        return response;
      }

      //if request is not cached, add it to cache
      return fetch(request).then(function(response) {
        var responseToCache = response.clone();
        caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(
          function(cache) {
            cache.put(request, responseToCache).catch(function(err) {
              console.warn(request.url + ': ' + err.message);
            });
          });

        return response;
      });
    })
  );
});

<%if(isPush){%>
//Adding `push` event listener
self.addEventListener('push', function(event) {
  console.info('Event: Push');

  var title = 'Push notification demo';
  var body = {
    'body': 'You have received a notification.',
    'tag': 'demo',
    'icon': '/images/touch/icon-128x128.png',
    //Custom actions buttons
    'actions': [
      { 'action': 'yes', 'title': 'I ♥ this app!' },
      { 'action': 'no', 'title': 'I don\'t like this app' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, body));
});

//Adding `notification` click event listener
self.addEventListener('notificationclick', function(event) {
  //Listen to custom action buttons in `push notification`
  if (event.action === 'yes') {
    console.log('I ♥ this app!');
  }
  else if (event.action === 'no') {
    console.warn('I don\'t like this app');
  }

  event.notification.close();
});
<%}%>

<%if(isBGsync){%>
//Adding `sync` event listener
self.addEventListener('sync', function(event) {
  console.info('Event: sync');

  var title = 'Background Sync event!';
  var body = {
    'body': 'App has updated in the background.',
    'tag': 'demo',
    'icon': '/images/touch/icon-128x128.png',
  };

  event.waitUntil(
    // You can play around with data here.
    self.registration.showNotification(title, body)
  );
});
<%}%>
