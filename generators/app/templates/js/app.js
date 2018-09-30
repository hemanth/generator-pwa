function updateFound() {
  const latestWorker = this.installing;

  // Wait for new SW installation.
  latestWorker.addEventListener('statechange', function() {
    switch (installingWorker.state) {
      case 'installed':
        // Installed, confrim a reload.
        if (navigator.serviceWorker.controller &&
            window.confirm('This page has been updated, do you want to load it?')) {
          window.location.reload();
          return;
        }
        break;

      case 'redundant':
        console.error('This SW is redundant :(');
        break;
    }
  });
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../sw.js', { scope: '/' }).then((registration) => {
		if (registration.installing) {
			console.log('Service worker installing');
		} else if(registration.waiting) {
			console.log('Service worker installed');
		} else if(registration.active) {
			console.log('Service worker active');
		}
    
    registration.addEventListener('updatefound', updateFound);

		<% if (isPush) { %>
		isPushNotification(registration); // Check push is supported and enabled already
		<% } %>
	}).catch((error) => {
		console.log('Registration failed with ' + error); // Registration failed
	});
}


