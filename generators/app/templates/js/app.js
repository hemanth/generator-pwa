if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(reg) {

		if(reg.installing) {
			console.log('Service worker installing');
		} else if(reg.waiting) {
			console.log('Service worker installed');
		} else if(reg.active) {
			console.log('Service worker active');
		}

	}).catch(function(error) {
		// registration failed
		console.log('Registration failed with ' + error);
	});

  // Communicate with the service worker using MessageChannel API.
  function sendMessage(message) {
    return new Promise(function(resolve, reject) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        resolve(`Direct message from SW: ${event.data}`);
      };

      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2])
    });
  }
}

//Push notification button
var btn = document.getElementById("turn-on-notification");

//Tokens
var apiKey = "AIzaSyCjrU5SqotSg2ybDLK_7rMMt9Rv0dMusvY";
var pushManager, endpoint;
var gcmURL = "https://android.googleapis.com/gcm/send";

// To check push notification support
function isPushSupported(reg) {
  if (!reg.pushManager) {
    alert("Push notifications is not supported in your browser");
    return;
  }

	//To check for push subscription status
  reg.pushManager.getSubscription()
  .then(function (subscription) {
    console.log("Push Notification Status: ", subscription);
    //If already access granted, change status
    if (subscription) {
      changeStatus(true);
    }
    else {
      changeStatus(false);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

//To subscript push notification
function subscribePush() {
  navigator.serviceWorker.ready
  .then(function(reg) {
    reg.pushManager.subscribe({
      userVisibleOnly: true //To always show notification when received
    })
    .then(function (subscription) {
      console.log("Successfully subscribed: ", subscription);
      console.log("Endpoint: ", subscription.endpoint);

      var temp = subscription.endpoint.split("/");
      endpoint = temp[temp.length - 1];
      localStorage.setItem("endpoint", JSON.stringify(endpoint));
      logCurlCommand(endpoint);
      changeStatus(true);
    })
    .catch(function (error) {
      console.log(error);
    })
  })
}

//To unsubscribe push notification
function unsubscribePush() {
  navigator.serviceWorker.ready
  .then(function(reg) {
    reg.pushManager.getSubscription()
    .then(function (pushSubscription) {
      //If not push subscription, then return
      if(!pushSubscription) {
        return;
      }

			//Unsubscribing push
      pushSubscription.unsubscribe()
      .then(function () {
        console.log("Successfully unsubscribed");
        endpoint = null;
        localStorage.removeItem("endpoint");
        changeStatus(false);
      })
      .catch(function (error) {
        console.log(error);
      });
    })
    .catch(function (error) {
      console.log("Failed to unsubscribe push notification");
    });
  })
}

//To change push status button
function changeStatus(status) {
  btn.dataset.checked = status;
  btn.checked = status;
}

//Click event for subscribe btn
btn.addEventListener("click", function () {
  var isBtnChecked = (btn.dataset.checked === "true");
  if (isBtnChecked) {
    unsubscribePush();
  }
  else {
    subscribePush();
  }
});

//To generate curl command to send push notification
function logCurlCommand(endPoint) {
  var curlCommand = 'curl --header "Authorization: key=' + apiKey +
	'" --header Content-Type:"application/json" ' + gcmURL + ' -d "{\\"registration_ids\\":[\\"' + endPoint + '\\"]}"';
  console.log("%ccurl command --> ", "background: #000; color: #fff; font-size: 16px;");
  console.log(curlCommand);
}
