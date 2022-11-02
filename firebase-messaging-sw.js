importScripts('https://www.gstatic.com/firebasejs/8.2.2/firebase.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.2/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCpqN92poc5NFto09faJrFJgVjivweAmlM",
    authDomain: "chatskoot-2aadb.firebaseapp.com",
    databaseURL:"https://chatskoot-2aadb-default-rtdb.firebaseio.com",
    projectId: "chatskoot-2aadb",
    storageBucket: "chatskoot-2aadb.appspot.com",
    messagingSenderId: "606272501457",
    appId: "1:606272501457:web:c21406b2a657680cbf77f0",
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.setBackgroundMessageHandler(function(payload) {
    console.log('Received background message ', payload);
  
    const notificationTitle = 'You have new text message';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
  });

  // const initializeFirebase = () => {
  //   firebase.initializeApp(firebaseConfig);
  //   const messaging = firebase.messaging();

  //   messaging.setBackgroundMessageHandler(function(payload) {
  //     console.log('Received background message ', payload);
    
  //     const notificationTitle = 'You have new text message';
  //     const notificationOptions = {
  //       body: 'Background Message body.',
  //       icon: '/firebase-logo.png'
  //     };
  
  //     return self.registration.showNotification(notificationTitle,
  //         notificationOptions);
  //   });
  // }

  
