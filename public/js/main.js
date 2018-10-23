document.addEventListener('DOMContentLoaded', () => {
    const socket = window.io();

    const remoteVideo = document.querySelector('#remote');
    const localVideo = document.querySelector('#local');
    const startCall = document.querySelector('#start-call');

    let webcamStream = null;

    window.getWebcam({ video: true, audio: false }).then(stream => {
        webcamStream = stream;
        window.attachStreamToVideo(stream, localVideo);
    });

    let callAnswered = false;

    startCall.addEventListener('click', event => {
        const caller = new window.SimplePeer({ initiator: true, stream: webcamStream, trickle: false, });

        caller.on('signal', sdp => {
            if (callAnswered) return;
            console.log('caller sdp');
            socket.emit('startCall', JSON.stringify(sdp));
        });

        socket.on('callAnswered', remoteSdp => {
            caller.signal(remoteSdp);
            callAnswered = true;
        });

        caller.on('stream', stream => {
            console.log('caller received stream');
            window.attachStreamToVideo(stream, remoteVideo);
        })
    });


    socket.on('callStarted', remoteSdp => {
        startCall.style.display = 'none';

        const callee = new window.SimplePeer({ initiator: false,  stream: webcamStream, trickle: false });

        callee.signal(remoteSdp);
        callee.on('signal', sdp => {
            if (callAnswered) return;
            console.log('callee sdp');
            socket.emit('answerCall', JSON.stringify(sdp));
        });


        callee.on('stream', stream => {
            console.log('callee received stream');
            window.attachStreamToVideo(stream, remoteVideo)
        })
    });
});
