const firebaseConfig = {
  apiKey: "AIzaSyCpqN92poc5NFto09faJrFJgVjivweAmlM",
  authDomain: "chatskoot-2aadb.firebaseapp.com",
  databaseURL:"https://chatskoot-2aadb-default-rtdb.firebaseio.com",
  projectId: "chatskoot-2aadb",
  storageBucket: "chatskoot-2aadb.appspot.com",
  messagingSenderId: "606272501457",
  appId: "1:606272501457:web:c21406b2a657680cbf77f0"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(function(user){
  if (user) {
    var userInfo = {email:'', name:'', photoURL:''};
    var userData = '';

    userInfo.email = user.email;
    userInfo.name = user.displayName;
    userInfo.photoURL = user.photoURL;

    var db = firebase.database().ref('users');
    var flag = false;

    db.on('value', function(users){
      users.forEach(function(data){
        var userData = data.val();
        if (userData.email === userInfo.email) {
            currentUser = data.key;
            flag = true;
            document.getElementById('user_profile').src = user.photoURL;
            document.getElementById('user_profile').title = user.displayName;
        
            document.getElementById('signInBtn').style = 'display:none';
            document.getElementById('signOutBtn').style = 'display:block';
        }
      });
      
      if (flag === false) {
        firebase.database().ref('users').push(userInfo);
        document.getElementById('user_profile').src = user.photoURL;
        document.getElementById('user_profile').title = user.displayName;
    
        document.getElementById('signInBtn').style = 'display:none';
        document.getElementById('signOutBtn').style = 'display:block';
        // firebase.database().ref('users').push(user_info, callback);
      }
    });
  }else{
    document.getElementById('signInBtn').style = 'display:block';
    document.getElementById('signOutBtn').style = 'display:none';
  }

  loadFrndList();
});


// function callback() {
//   if (error) {
//     alert(error);
//   } else {
//     document.getElementById('user_profile').src = user.photoURL;
//     document.getElementById('user_profile').title = user.displayName;

//     document.getElementById('signInBtn').style = 'display:none';
//     document.getElementById('signOutBtn').style = 'display:block';
//   }
// }