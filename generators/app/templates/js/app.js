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
  function canPush() {
    //To check `notification` permission is denied by user
    if (window.Notification && window.Notification.permission === 'denied') {
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
					else {
						sendPushNotification();
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

  //To send `push notification` request to server
  function sendPushNotification(subscription) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.pushManager.getSubscription()
        .then((subscription) => {
					//Send `push notification`
					var url = '/sendNotification?endpoint=' + subscription.endpoint;
          fetch(url, {
            method: 'post'
          })
          .then((response) => {
            return response.json();
          })
        })
      })
  }

  canPush(); //Check for push notification support.
  updateNetworkStatus(); //Check user connectivity initially.
})();
