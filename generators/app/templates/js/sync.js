(function () {
  'use strict';

  var bgSyncTextElement = document.querySelector('.bg-sync-text');
  var bgSyncElement = document.querySelector('.custom-button-bg');
  var bgSyncBtnElement = document.querySelector('.turn-on-sync');

  //`BG Sync` register button
  bgSyncBtnElement.addEventListener('click', function () {
    registerBGSync();
  });

  //To register `BG Sync`
  function registerBGSync() {
    navigator.serviceWorker.ready
      .then(function (registration) {
        return registration.sync.register('demo') //Tag name `demo`
          .then(function (rs) {
            console.info('Background sync registered!');
            bgSyncElement.classList.add('hide');
            bgSyncTextElement.removeAttribute('hidden');
          }, function () {
            console.error('Background sync registered failed ', error);
          });
      });
  }
})();
