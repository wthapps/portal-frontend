console.debug('... inside sw.js ...');

// Install Service Worker
self.addEventListener('install', function (event) {
  console.log('installed!');
});

// Service Worker Active
self.addEventListener('activate', function (event) {
  console.log('activated!');
});

self.addEventListener("push", function (event) {
  var json = {
    title: 'notification',
    body: 'You got a notification. Great!!!',
    icon: 'android-icon-48x48.png'
  };
  self.registration.showNotification(json.title, {
    body: json.body,
    icon: json.icon
  });
});

self.addEventListener('fetch', function (event) {
  console.log(event.request.url);
});

self.addEventListener('message', function (e) {
  if (e.data.updateSw) {
    self.skipWaiting();
  }
});
