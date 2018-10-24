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
        const peer1 = new window.SimplePeer({ initiator: true, stream: webcamStream, trickle: false, });

        peer1.on('signal', sdp => {
            if (callAnswered) return;
            console.log('peer1 sdp');
            socket.emit('startCall', JSON.stringify(sdp));
        });

        socket.on('callAnswered', remoteSdp => {
            peer1.signal(remoteSdp);
            callAnswered = true;
        });

        peer1.on('stream', stream => {
            console.log('caller received stream');
            window.attachStreamToVideo(stream, remoteVideo);
        })
    });


    socket.on('callStarted', remoteSdp => {
        startCall.style.display = 'none';

        const peer2 = new window.SimplePeer({ initiator: false,  stream: webcamStream, trickle: false });

        peer2.signal(remoteSdp);
        peer2.on('signal', sdp => {
            if (callAnswered) return;
            console.log('peer2 sdp');
            socket.emit('answerCall', JSON.stringify(sdp));
        });


        peer2.on('stream', stream => {
            console.log('peer2 received stream');
            window.attachStreamToVideo(stream, remoteVideo)
        })
    });
});
