//1 open Stream ;
//2 play in stream ; 
const socket = io('http://localhost:2000');

$('#div-chat').hide();

// lang nghe danh sach online ;
socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dangky').hide();
    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    // lang nghe danh sach online moi lang nghe gnuoi dung moi ;
    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });

});

socket.on('DANG_KY_THAT_BAI', () => {
    alert('vui long chon user khac');
});

function openStream() {
    const config = { audio: false, video: true }
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream()
//     .then(stream => playStream('localStream',stream));

const peer = new Peer({ key: 'lwjd5qra8257b9' });

peer.on('open', id => {
    // lay ra the nao do co id la : my-peer
    document.getElementById('my-peer').innerHTML = id;
    // signUp 
    $('#btnSignUp').click(function () {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
})

// nguoi call di ;
$('#btnCall').click(function () {
    const id = $('#remoteId').val();
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});

// nguoi nhan ;
peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});


// dynamic click ;
$('#ulUser').on('click', 'li', function () {
    const id = ($(this).attr('id'));
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});