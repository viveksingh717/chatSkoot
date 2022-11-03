const firebaseConfig = {
  apiKey: "AIzaSyCpqN92poc5NFto09faJrFJgVjivweAmlM",
  authDomain: "chatskoot-2aadb.firebaseapp.com",
  databaseURL: "https://chatskoot-2aadb-default-rtdb.firebaseio.com",
  projectId: "chatskoot-2aadb",
  storageBucket: "chatskoot-2aadb.appspot.com",
  messagingSenderId: "606272501457",
  appId: "1:606272501457:web:c21406b2a657680cbf77f0",
};

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// firebase.auth().onAuthStateChanged(function (user) {
//   if (user) {
//     var userInfo = { email: "", name: "", photoURL: "" };
//     var userData = "";

//     userInfo.email = user.email;
//     userInfo.name = user.displayName;
//     userInfo.photoURL = user.photoURL;

//     var db = firebase.database().ref("users");
//     var flag = false;

//     db.on("value", function (users) {
//       users.forEach(function (data) {
//         var userData = data.val();
//         if (userData.email === userInfo.email) {
//           currentUser = data.key;
//           flag = true;
//           document.getElementById("user_profile").src = user.photoURL;
//           document.getElementById("user_profile").title = user.displayName;

//           document.getElementById("signInBtn").style = "display:none";
//           document.getElementById("signOutBtn").style = "display:block";
//         }
//       });

//       if (flag === false) {
//         firebase.database().ref("users").push(userInfo);
//         document.getElementById("user_profile").src = user.photoURL;
//         document.getElementById("user_profile").title = user.displayName;

//         document.getElementById("signInBtn").style = "display:none";
//         document.getElementById("signOutBtn").style = "display:block";
//         // firebase.database().ref('users').push(user_info, callback);
//       }
    
//       loadFrndList();
//     });
//   } else {
//     document.getElementById("signInBtn").style = "display:block";
//     document.getElementById("signOutBtn").style = "display:none";
//   }
// });


const initializeFirebase = () => {
  firebase.initializeApp(firebaseConfig);

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var userInfo = { email: "", name: "", photoURL: "" };
      var userData = "";
  
      userInfo.email = user.email;
      userInfo.name = user.displayName;
      userInfo.photoURL = user.photoURL;
  
      var db = firebase.database().ref("users");
      var flag = false;
  
      db.on("value", function (users) {
        users.forEach(function (data) {
          userData = data.val();
          if (userData.email === userInfo.email) {
            currentUser = data.key;
            flag = true;
            document.getElementById("user_profile").src = user.photoURL;
            document.getElementById("user_profile").title = user.displayName;
  
            document.getElementById("signInBtn").style = "display:none";
            document.getElementById("signOutBtn").style = "display:block";
          }
        });
  
        if (flag === false) {
          firebase.database().ref("users").push(userInfo);
          document.getElementById("user_profile").src = user.photoURL;
          document.getElementById("user_profile").title = user.displayName;
  
          document.getElementById("signInBtn").style = "display:none";
          document.getElementById("signOutBtn").style = "display:block";
          // firebase.database().ref('users').push(user_info, callback);
        }

        // const messaging = firebase.messaging();
        // messaging.usePublicVapidKey("BKC-AqXTH9LC2J2AF3eWlD3GyRjY8eWNjPYDSUTNeCNvO0yXwqTrs-eI0SO4Y0uJQ_X1AxEJ8-qSFcb4N0mfo4k");
        
        // messaging.requestPermission().then(function() {
        //  return messaging.getToken();
        // }).then(function(token) {
        //   console.log(token)
        //   firebase.database().ref('fcmTokens').child(currentUser).set({token_id:token});
        // }).catch(function() {
        //   console.log('Access Denied!');
        // })
    
        loadFrndList();
        notificationCounter();
      });
    } else {
      document.getElementById("signInBtn").style = "display:block";
      document.getElementById("signOutBtn").style = "display:none";
    }
  });
}
