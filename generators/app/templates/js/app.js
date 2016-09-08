(function () {
	'use strict';
	
	//Listen to `offline/online` event
	window.addEventListener('offline', updateNetworkStatus, false);
	window.addEventListener('online', updateNetworkStatus, false);

	function updateNetworkStatus() {
		if (navigator.onLine) {
			console.info('Application is online.');
		}
		else {
			console.info('Application is offline.');
		}
	}

	updateNetworkStatus(); //Check user connectivity initially
})();
