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

	//To check `push notification` is supported
  function isPushSupported() {
    //To check `notification` permission is denied by user
    if (Notification && Notification.permission === 'denied') {
      console.warn('User has blocked notifications.');
      return;
    }

    //Check `push notification` is supported or not
    if (!('PushManager' in window)) {
      console.warn('Push notification isn\'t supported in your browser.');
      return;
    }

    //Get `push notification` subscription, check if push is already subscribed/unsubscribed
    navigator.serviceWorker.ready
      .then(function (registration) {
        registration.pushManager.getSubscription()
        .then((subscription) => {
          console.info('Push notification status:', !!subscription);
          //If already access granted, change status
          if (!subscription) {
            subscribePush()
          }
        })
        .catch((error) => {
          console.error('Error occurred while enabling push ', error);
        });
    });
  }

  //To subscribe `push notification`
  function subscribePush() {
    navigator.serviceWorker.ready
    .then((registration) => {
      registration.pushManager.subscribe({
        userVisibleOnly: true //To always show notification when received
      })
      .then((subscription) => {
        console.info('Push notification subscribed.');
        sendPushNotification(); //send a push notification after confirmation.
      })
      .catch((error) => {
        console.error('Push notification subscription error: ', error);
      })
    })
  }

  //To unsubscribe `push notification`
  function unsubscribePush() {
    navigator.serviceWorker.ready
    .then((registration) => {
      registration.pushManager.getSubscription()
      .then((subscription) => {
        //If no `push subscription`, then return
        if(!subscription) {
          console.error('Unable to unregister push notification.');
          return;
        }

        //Unsubscribe `push notification`
        subscription.unsubscribe()
          .then(() => {
            console.info('Push notification unsubscribed.');
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error('Failed to unsubscribe push notification.');
      });
    })
  }

  //To send `push notification` request to server
  function sendPushNotification(subscription) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.pushManager.getSubscription()
        .then((subscription) => {
          //Send `push notification` - source for below url `server.js`
          fetch('/send_notification', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
          })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.error('Error occurred while sending push notification ', data);
          })
        })
      })
  }

  isPushSupported(); //Check for push notification support
	updateNetworkStatus(); //Check user connectivity initially
})();
