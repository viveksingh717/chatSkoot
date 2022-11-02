// Global variable declaired
var currentUser = '';
var chatKey = '';

document.addEventListener('keydown', function(key){
    if (key.which === 13) {
        sendTextMsg();
    }
});

function loadMessage(chatKey, frndPhoto){
    var db = firebase.database().ref('chatMessage').child(chatKey);
    db.on('value', function(chats){
        var displayMessage = '';
        chats.forEach(function(data){
            var chatMsgs = data.val();
            var msg = '';

            if(chatMsgs.msgType === 'fileMsg' ){
                msg = `<img src="${chatMsgs.chatMsg}" class="img-fluid">`;
            } else if(chatMsgs.msgType === 'audioMsg' ){
                msg = `<audio class="mt-4" id="audio" controls>
                    <source src="${chatMsgs.chatMsg}" type="audio/webm" />
                </audio>`;
            }
            else{
                msg = chatMsgs.chatMsg;
            }

            if (chatMsgs.user_id !== currentUser) 
            {
                displayMessage += `<div class="row justify-content-end" id="recieve">
                                        <div class="col-6 col-sm-6 col-md-6">
                                            <p class="border bg-gradient float-end sentMsg">${msg}
                                                <span class="chatTime mt-3">${chatMsgs.timestamp} PM</span></p>
                                        </div>
                                        <div class="col-2 col-sm-1 col-md-1">
                                            <img src="${frndPhoto}" class="rounded-circle" alt="User-Logo" height="30px" width="30px">
                                        </div>
                                    </div>`;
            } 
            else 
            {
                displayMessage += `<div class="row" id="sent">
                                    <div class="col-2 col-sm-1 col-md-1">
                                        <img src="${firebase.auth().currentUser.photoURL}" class="rounded-circle" alt="User-Logo" height="30px" width="30px">
                                    </div>
                                    <div class="col-6 col-sm-6 col-md-6">
                                        <p class="border bg-gradient recieveMsg">${msg}
                                            <span class="chatTime float-end mt-3">${chatMsgs.timestamp} PM</span></p>
                                    </div>
                                </div>`;
            }
        });

        document.getElementById('msgBox').innerHTML = displayMessage;
        
        document.getElementById('msgBox').scrollTo(0, document.getElementById('msgBox').clientHeight);
    });
}
function startChat(frndKey, frndName, frndPhoto){
    var storeDb = firebase.database().ref('frndList');
    var frndDetails = {frndId:frndKey, userId:currentUser};
    var flag = false;
    
    storeDb.on('value', function(frndData){
        frndData.forEach(function(data){
            var usrs = data.val();

            if (usrs.frndId === frndDetails.frndId && usrs.userId === frndDetails.userId || (usrs.frndId === frndDetails.userId && usrs.userId === frndDetails.frndId)) {
                chatKey = data.key;
                flag = true;
            }
        });

        if (flag === false) {
            chatKey = storeDb.push(frndDetails);
            chatKey.getKey;

            document.getElementById('chatPanel').removeAttribute('style');
            document.getElementById('theme_card').setAttribute('style', 'display:none');

            hide_chat();
        }else{
            document.getElementById('chatPanel').removeAttribute('style');
            document.getElementById('theme_card').setAttribute('style', 'display:none');

            hide_chat();
        }

        document.getElementById('frndPhoto').src = frndPhoto;
        document.getElementById('frndName').innerHTML = frndName;
        // document.getElementById('frndLastSeen').innerHTML = '';
        
        document.getElementById('msgBox').innerHTML = '';
        
        // onKeyDown();
        document.getElementById('textMsg').value = '';
        document.getElementById('textMsg').focus();

        loadMessage(chatKey, frndPhoto);

    });
}

function show_chat(){
    document.getElementById('side-1').classList.remove('d-none', 'd-md-block');
    document.getElementById('side-2').classList.add('d-none');
}

function hide_chat(){
    document.getElementById('side-1').classList.add('d-none', 'd-md-block');
    document.getElementById('side-2').classList.remove('d-none');
}

// function onKeyDown() {
//     document.addEventListener('keydown', function(key){
//         if (key.which === 13) {
//             sendTextMsg();
//         }
//     });
// }

function sendTextMsg(){
    textMsg = document.getElementById('textMsg').value;
    var msg = {
        user_id:currentUser, chatMsg:textMsg, msgType:'textMSg', timestamp:new Date().toLocaleDateString()
    };

    sendDb = firebase.database().ref('chatMessage');

    if (sendDb.child(chatKey).push(msg)) {
        var message = `<div class="row">
                            <div class="col-2 col-sm-1 col-md-1">
                                <img src="${firebase.auth().currentUser.photoURL}" class="rounded-circle" alt="User-Logo" height="30px" width="30px">
                            </div>
                            <div class="col-6 col-sm-6 col-md-6">
                                <p class="border bg-gradient recieveMsg">${textMsg}
                                    <span class="chatTime float-end mt-3">1:20 PM</span></p>
                            </div>
                        </div>`;

        document.getElementById('msgBox').innerHTML += message;
        document.getElementById('textMsg').value = '';
        document.getElementById('textMsg').focus();

        // document.getElementById('msgBox').scrollTo(0, document.getElementById('msgBox').clientHeight);
    }
}

function chooseImage() {
    document.getElementById('fileUpload').click();
}

function sendImage(event) {
    var file = event.files[0];

    if (!file.type.match('image.*')) {
        alert('Please select image file only');
    }else{
        var reader = new FileReader();

        reader.addEventListener('load', function() {
            textMsg = reader.result;
            
            var msg = {
                user_id:currentUser, chatMsg:textMsg, msgType:'fileMsg', timestamp:new Date().toLocaleString()
            };
        
            sendDb = firebase.database().ref('chatMessage');
        
            if (sendDb.child(chatKey).push(msg)) {
                
        
                document.getElementById('msgBox').innerHTML += message;
                document.getElementById('textMsg').value = '';
                document.getElementById('textMsg').focus();
        
                // document.getElementById('msgBox').scrollTo(0, document.getElementById('msgBox').clientHeight);
            }
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }
}

function loadFrndList() {
    var loadDb = firebase.database().ref('frndList');
    var usrDb = firebase.database().ref('users');

    loadDb.on('value', function(listData){
    document.getElementById('loadFrndLists').innerHTML = 
                        `<li class="list-group-item" style="background-color: #f8f8f8;">
                            <input type="text" name="#" class="form-control rounded" placeholder="Search or Start chat">
                        </li>`;
        listData.forEach(function(data){
            frndLists = data.val();
            var frndKey = '';

            if (frndLists.frndId === currentUser) {
                frndKey = frndLists.userId;
            }else if(frndLists.userId === currentUser){
                frndKey = frndLists.frndId;
            }

            if (frndKey !== '') {
                usrDb.child(frndKey).on('value', function(data){
                    usrInf = data.val();
    
                    document.getElementById('loadFrndLists').innerHTML += 
                                        `<li class="list-group-item list-group-item-action" onclick="startChat('${data.key}', '${usrInf.name}', '${usrInf.photoURL}')">
                                        <div class="row">
                                            <div class="col-md-2">
                                                <img src="${usrInf.photoURL}" class="rounded-circle" alt="Users-Logo" height="50px" width="50px">
                                            </div>
                                            <div class="col-md-10">
                                                <div class="user-name">${usrInf.name}</div>
                                                <div class="user-text">Hello world this is my chat App...</div>
                                            </div>
                                        </div>
                                    </li>`;
                });
            }
        });
    });
}

function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);

    // loadFrndList();
}

function signOut() {
    firebase.auth().signOut();
    window.location.reload();
}

function fetchFrndList() {
    document.getElementById('UlList').innerHTML = 
                                        `<div class="text-center">
                                            <div class="spinner-border fs-5"></div>
                                            <p class="fw-bold">Loading...</p>
                                        </div>`;
    
    var firebaseDb = firebase.database().ref('users');
    var list = '';

    firebaseDb.on('value', function(userDetails){

        if (userDetails.hasChildren()) {
            list = `<li class="list-group-item" style="background-color: #f8f8f8;">
                        <input type="text" name="#" class="form-control rounded" placeholder="Search or Start chat">
                    </li>`;
        }

        userDetails.forEach(function(data){
            var userData = data.val();
            if (userData.email !==firebase.auth().currentUser.email) {
                list += `<li class="list-group-item list-group-item-action" data-bs-dismiss="modal" onclick="startChat('${data.key}', '${userData.name}', '${userData.photoURL}')">
                        <div class="row">
                            <div class="col-md-2">
                                <img src="${userData.photoURL}" class="rounded-circle" alt="Users-Logo" height="30px" width="30px">
                            </div>
                            <div class="col-md-10">
                                <div class="user-name">${userData.name}</div>
                            </div>
                        </div>
                    </li>`; 
            }
        });

        document.getElementById('UlList').innerHTML = list;
    });                                  
}

function openSmily() {
    document.getElementById('smileyBox').removeAttribute('style');
    // document.getElementsByClassName('tabpanel1').removeAttribute('style');
}

function hideSmilyPanel() {
    document.getElementById('smileyBox').setAttribute('style', 'display:none');
}

function getEmoji(control) {
    document.getElementById('textMsg').value += control.innerHTML;
}

function loadAllEmoji() {
    var emoji = '';

    for(i=128512; i<= 128567; i++){
        emoji += `<a href="#" style="cursor: pointer; text-decoration: none;" onclick="getEmoji(this)">&#${i};</a>`;
    }

    document.getElementById('pills-smiley').innerHTML = emoji;
}

function loadAllEmoji1() {
    var emoji = '';

    for(i=128101; i<= 129506; i++){
        emoji += `<a href="#" style="cursor: pointer; text-decoration: none;" onclick="getEmoji(this)">&#${i};</a>`;
    }

    document.getElementById('pills-flag').innerHTML = emoji;
}

function changeSendIcon(control) {
    if (control.value !== '') {
        document.getElementById('send').removeAttribute('style');
        document.getElementById('audioMic').setAttribute('style', 'display:none');
    }else{
        document.getElementById('send').setAttribute('style', 'display:none');
        document.getElementById('audioMic').removeAttribute('style');
    }
}

//Audio functionality
let chunk = [];
let recorder;
var timeout;

function recordStart(control) {
    let device = navigator.mediaDevices.getUserMedia({audio:true});
    device.then((stream)=> {
        if (recorder === undefined) {  
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = e => {
                chunk.push(e.data);
        
                if (recorder.state === 'inactive') {
                    let blob = new Blob(chunk, {type:'audio/webm'});
                    // document.getElementById('audio').innerHTML = '<source src="'+URL.createObjectURL(blob)+'" type="audio/webm" />'
                       var reader = new FileReader();
        
                       reader.addEventListener('load', function() {
                           textMsg = reader.result;
                           var msg = {
                               user_id:currentUser, 
                               chatMsg:textMsg, 
                               msgType:'audioMsg', 
                               timestamp:new Date().toLocaleString()
                           };
                       
                           sendDb = firebase.database().ref('chatMessage');
                       
                           if (sendDb.child(chatKey).push(msg)) {
                               document.getElementById('textMsg').value = '';
                               document.getElementById('textMsg').focus();               
                           }
                       }, false);
               
                    reader.readAsDataURL(blob);
                }
            }
            recorder.start();
            control.setAttribute('class', 'fa fa-circle-stop');
        }
    });

    if (recorder !== undefined)  {
        if (control.getAttribute('class').indexOf('circle-stop') !== -1) {
            recorder.stop();
            control.setAttribute('class', 'fa fa-microphone')
        }else{
            chunk = [];
            recorder.start();
            control.setAttribute('class', 'fa fa-circle-stop');
        }
    }

}

loadAllEmoji();
loadAllEmoji1();

