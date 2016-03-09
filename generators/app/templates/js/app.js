if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../sw.js', { scope: '/' }).then((reg) => {
		if (reg.installing) {
			console.log('Service worker installing');
		} else if(reg.waiting) {
			console.log('Service worker installed');
		} else if(reg.active) {
			console.log('Service worker active');
		}
		<% if (isPush) { %>
		isPushNotification(reg); // Check push is supported and enabled already
		<% } %>
	}).catch((error) => {
		console.log('Registration failed with ' + error); // Registration failed
	});

  // Communicate with the service worker using MessageChannel API.
  function sendMessage(message) {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        resolve(`Direct message from SW: ${event.data}`);
      };

      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2])
    });
  }
}
