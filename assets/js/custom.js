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
    // document.getElementById('UlList').innerHTML = 
    //                                     `<div class="text-center">
    //                                         <div class="spinner-border fs-5"></div>
    //                                         <p class="fw-bold">Loading...</p>
    //                                     </div>`;
    
    // var firebaseDb = firebase.database().ref('users');
    // var list = '';
    // var frndData = '';

    // firebaseDb.on('value', function(frndDetails){

    //     if (frndDetails.hasChildren()) {
    //         list = `<li class="list-group-item" style="background-color: #f8f8f8;">
    //                     <input type="text" name="#" class="form-control rounded" placeholder="Search or Start chat">
    //                 </li>`;
    //     }

    //     frndDetails.forEach(function(data){
    //         frndData = data.val();
    //         if (frndData.email !==firebase.auth().currentUser.email) {
    //             list += `<li class="list-group-item list-group-item-action" data-bs-dismiss="modal" onclick="startChat('${data.key}', '${frndData.name}', '${frndData.photoURL}')">
    //                     <div class="row">
    //                         <div class="col-md-2">
    //                             <img src="${frndData.photoURL}" class="rounded-circle" alt="Users-Logo" height="30px" width="30px">
    //                         </div>
    //                         <div class="col-md-10">
    //                             <div class="user-name">${frndData.name}</div>
    //                         </div>
    //                     </div>
    //                 </li>`; 
    //         }
    //     });

    //     document.getElementById('UlList').innerHTML = list;
    // });                                  
}

function fetchUserList() {
    document.getElementById('UrsList').innerHTML = 
                                        `<div class="text-center">
                                            <div class="spinner-border fs-5"></div>
                                            <p class="fw-bold">Loading...</p>
                                        </div>`;
    
    var firebaseFrndDb = firebase.database().ref('users');
    let counterDb = firebase.database().ref('notification');
    var list = '';
    var userData ='';

    firebaseFrndDb.on('value', function(userDetails){

        if (userDetails.hasChildren()) {
            list = `<li class="list-group-item" style="background-color: #f8f8f8;">
            <input type="text" name="#" class="form-control rounded" placeholder="Search or Start chat">
            </li>`;
            document.getElementById('UrsList').innerHTML = list;
        }

        userDetails.forEach(function(data){
            userData = data.val();
            if (userData.email !==firebase.auth().currentUser.email) {
                counterDb.orderByChild('sendTo').equalTo(data.key).on('value', function(notify){
                    if (notify.numChildren() > 0 && Object.values(notify.val())[0].sendFrom === currentUser) {
                        list = `<li class="list-group-item list-group-item-action">
                            <div class="row">
                                <div class="col-md-2">
                                    <img src="${userData.photoURL}" class="rounded-circle" alt="Users-Logo" height="30px" width="30px">
                                </div>
                                <div class="col-md-10">
                                    <div class="user-name">
                                    ${userData.name}
                                    <button class="btn btn-secondary btn-sm disabled float-end" onclick="sendRequest('${data.key}')"><i class="fa-solid fa-user-plus"></i> Sent </button>
                                    </div>
                                </div>
                            </div>
                        </li>`; 
                        document.getElementById('UrsList').innerHTML += list;
                    }else{
                        counterDb.orderByChild('sendFrom').equalTo(data.key).on('value', function(notify){
                            if (notify.numChildren() > 0 && Object.values(notify.val())[0].sendTo === currentUser) 
                            {
                                list = `<li class="list-group-item list-group-item-action">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <img src="${userData.photoURL}" class="rounded-circle" alt="Users-Logo" height="30px" width="30px">
                                        </div>
                                        <div class="col-md-10">
                                            <div class="user-name">
                                            ${userData.name}
                                            <button class="btn btn-success btn-sm float-end" onclick="sendRequest('${data.key}')"> Friend </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>`; 
                                document.getElementById('UrsList').innerHTML += list;
                            }else{
                                list = `<li class="list-group-item list-group-item-action">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <img src="${userData.photoURL}" class="rounded-circle" alt="Users-Logo" height="30px" width="30px">
                                        </div>
                                        <div class="col-md-10">
                                            <div class="user-name">
                                            ${userData.name}
                                            <button class="btn btn-primary btn-sm float-end" onclick="sendRequest('${data.key}')"><i class="fa-solid fa-user-plus"></i> Send Request </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>`; 
                                document.getElementById('UrsList').innerHTML += list;
                            }
                        });
                    }
                });
            }
        });
    });                                  
}

function sendRequest(key) {
    let notifications = {
        sendTo:key,
        sendFrom:currentUser,
        senderName:firebase.auth().currentUser.displayName,
        senderPhoto:firebase.auth().currentUser.photoURL,
        status:'Pending',
        dateTime:new Date().toLocaleString(),
    }

    firebase.database().ref('notification').push(notifications, function(error){
        if (error) {
            alert(error);
        }else{
            fetchUserList();
        }
    })
}

function notificationCounter() {
    let counterDb = firebase.database().ref('notification');

    counterDb.orderByChild('sendTo').equalTo(currentUser).on('value', function(notify){
        let objsArry = Object.values(notify.val()).filter(n => n.status === 'Pending');

        if (objsArry) {
            document.getElementById('notiCounter').innerHTML = objsArry.length;
        }
    });
}

function getAllNotification() {
    document.getElementById('notify').innerHTML = 
                            `<div class="text-center">
                                <div class="spinner-border fs-5"></div>
                                <p class="fw-bold">Loading...</p>
                            </div>`;
    
    // let userDB = firebase.database().ref('users');
    let notiDB = firebase.database().ref('notification');
    var list = '';
    var frndData = '';

    notiDB.orderByChild('sendTo').equalTo(currentUser).on('value', function(notifyy){
        notifyy.forEach(function(data){
            notifyData = data.val();
            if (notifyData.status === 'Pending') {
                list += `<li class="list-group-item list-group-item-action">
                        <div class="row">
                            <div class="col-md-2">
                                <img src="${notifyData.senderPhoto}" class="rounded-circle" alt="Users-Logo" height="30px" width="30px">
                            </div>
                            <div class="col-md-10">
                                <div class="user-name">${notifyData.senderName}
                                <button class="btn btn-danger btn-sm float-end ms-1" onclick="rejectReq('${data.key}')"><i class="fa-solid fa-user-times"></i> Reject </button>

                                <button class="btn btn-success btn-sm float-end" onclick="acceptReq('${data.key}')"><i class="fa-solid fa-user-plus"></i> Accept </button>
                                </div>
                            </div>
                        </div>
                    </li>`;
            }
        });

        document.getElementById('notify').innerHTML = list;
    });                                  
}

function rejectReq(key){
    let Db1 = firebase.database().ref('notification');
    Db1.child(key).once('value', function(notifydata){
        let obj = notifydata.val();
        console.log(obj);
        obj.status = 'Reject';

        firebase.database().ref('notification').child(key).update(obj, function(error){
            if (error) {
                alert(error);
            }else{
                getAllNotification();
            }
        });
    });

}

function acceptReq(key){
    let Db2 = firebase.database().ref('notification');
    Db2.child(key).once('value', function(notifydata){
        var obj = notifydata.val();
        console.log(obj);
        obj.status = 'Accept';

        firebase.database().ref('notification').child(key).update(obj, function(error){
            if (error) {
                alert(error);
            }else{
                let storeDb2 = firebase.database().ref('frndList');
                var frndDetails = {frndId:obj.sendFrom, userId:obj.sendTo};

                storeDb2.push(frndDetails, function(error){
                    if (error) {
                        alert(error);
                    }else{
                        loadFrndList();
                    }
                });
                getAllNotification();
            }
        });
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

