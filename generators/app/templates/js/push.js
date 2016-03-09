//Push notification button
const btn = document.getElementById('turn-on-notification');

//Tokens
const apiKey = 'AIzaSyCjrU5SqotSg2ybDLK_7rMMt9Rv0dMusvY'; //API key
const gcmURL = 'https://android.googleapis.com/gcm/send';

//To check push notification support
function isPushNotification(reg) {
  reg.pushManager.getSubscription()
  .then((subscription) => {
    console.log('Push Notification Status: ', subscription);
    //If already access granted, change status
    if (subscription) {
      changeStatus(true);
    }
    else {
      changeStatus(false);
    }
  })
  .catch((error) => {
    console.error(error);
  });
}

//To subscript push notification
function subscribe() {
  navigator.serviceWorker.ready
  .then((registration) => {
    if (!registration.pushManager) {
      alert('Your browser doesn\'t support push notifications');
      return;
    }

    registration.pushManager.subscribe({
      userVisibleOnly: true //To always show notification when received
    })
    .then((subscription) => {
      console.log('Successfully subscribed: ', subscription);
      changeStatus(true);
    })
    .catch((error) => {
      console.error(error);
    })
  })
}

//To unsubscribe push notification
function unsubscribe() {
  navigator.serviceWorker.ready
  .then((registration) => {
    registration.pushManager.getSubscription()
    .then((subscription) => {
      //If not push subscription, then return
      if(!subscription) {
        console.error('Unable to unregister from push notification');
        return;
      }

      //Unsubscribe
      subscription.unsubscribe()
        .then(() => {
          console.log('Successfully unsubscribed');
          changeStatus(false);
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error('Failed to unsubscribe push notification');
    });
  })
}


//To send push notification
const pushBtn = document.getElementById('send-push');
pushBtn.addEventListener('click', () => {
  sendPushNotification();
});

//To change status
function changeStatus(status) {
  btn.dataset.checked = status;
  btn.checked = status;
  if (status) {
    pushBtn.style.display = 'block';
  }
  else {
    pushBtn.style.display = 'none';
  }
}

//Click event for subscribe btn
btn.addEventListener('click', () => {
  var isBtnChecked = (btn.dataset.checked === 'true');
  if (isBtnChecked) {
    unsubscribe();
  }
  else {
    subscribe();
  }
});

//To generate curl command to send push notification
function curlCommand(subscription) {
  var temp = subscription.endpoint.split('/');
  var endpoint = temp[temp.length - 1];
  var curlCommand = 'curl --header "Authorization: key=' + apiKey + '" --header Content-Type:"application/json" ' + gcmURL + ' -d "{\\"registration_ids\\":[\\"' + endpoint + '\\"]}"';
  console.log('%ccurl command: ', 'background: #000; color: #fff; font-size: 16px;');
  console.log(curlCommand);
}

//Form data with info to send to server
function sendPushNotification(subscription) {
  navigator.serviceWorker.ready
    .then((registration) => {
      registration.pushManager.getSubscription()
      .then((subscription) => {
        curlCommand(subscription); //To log curl command in console
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
          console.error('data', data);
        })
      })
    })
}
