//If `service worker` is supported, then register it.
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../serviceWorker.js', { scope: '/' }).then((registration) => {
		if (registration.installing) {
			console.info('Service worker installing.');
		}
    else if (registration.waiting) {
			console.info('Service worker installed.');
		}
    else if (registration.active) {
			console.info('Service worker active.');
		}
	}).catch((error) => {
		console.error('Service worker registration failed ', error);
	});
}
