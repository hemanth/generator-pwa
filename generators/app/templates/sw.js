importScripts('./sw-cache-polyfill.js');

var CACHE_NAME = 'sw-ex';
var CACHE_VERSION = 1;

self.oninstall = function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(function(cache) {
      return cache.addAll(['/', '/index.html', '/images/yeoman.png']);
    })
  );
};

self.onactivate = function(event) {
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
};

self.onfetch = function(event) {
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
};


// Communicate via MessageChannel.
self.addEventListener('message', function(event) {
  console.log(`Received message from main thread: ${event.data}`);
  event.ports[0].postMessage(`Got message! Sending direct message back - "${event.data}"`);
});

// Broadcast via postMessage.
function sendMessage(message) {
  self.clients.matchAll().then(function(clients) {
    clients.map(function(client) {
      return client.postMessage(message);
    })
  });
}

//Listen to push event
self.addEventListener("push", function(event) {
  console.log("Push notification received ", event);

  var title = "Push notification demo";
  var body = "You have received a notification";
  var tag = "pwa";
  var icon = "/images/touch/icon-128x128.png";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      tag: tag,
      icon: icon
    })
  );
});

//On click event for notification to close
self.addEventListener("notificationclick", function(event) {
  console.log("Notification received ", event);
  event.notification.close();
});
