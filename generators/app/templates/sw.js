(function() {
var CACHE_NAME = 'sw-ex';
var CACHE_VERSION = 1;

var filesToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/images/yeoman.png',
  '/images/touch/chrome-touch-icon-192x192.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  var currentCacheName = CACHE_NAME + '-v' + CACHE_VERSION;
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        if (cacheName.indexOf(CACHE_NAME) == -1) {
          return;
        }

        if (cacheName != currentCacheName) {
          return caches.delete(cacheName);
        }
      })
    );
  });
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  event.respondWith(
    caches.match(request).then(function(response) {
      if (response) {
        return response;
      }

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

//To send notification to client
self.addEventListener('push', function(event) {
  console.log('Event: Push', event);

  var title = 'Push notification demo';
  var body = 'You have received a notification';
  var tag = 'demo';
  var icon = '/images/touch/icon-128x128.png';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      tag: tag,
      icon: icon
    })
  );
});

//On click event for notification to close
self.addEventListener('notificationclick', function(event) {
  console.log('Notification is clicked ', event);
  event.notification.close();
});
<%}%>

<%if(isBGsync){%>
// Background Sync.
self.addEventListener('sync', function(event) {
  console.log('Event: Push', event);

  var title = 'Background Sync event!';
  var body = 'App has updated in the background.'
  var tag = 'demo';
  var icon = '/images/touch/icon-128x128.png';

  event.waitUntil(
    // You can play around with data here.
    self.registration.showNotification(title, {
      body: body,
      tag: tag,
      icon: icon
    })
  );  
});
<%}%>
}())