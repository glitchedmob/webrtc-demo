document.addEventListener('DOMContentLoaded', () => {

    const remoteVideo = document.querySelector('#remote');
    const localVideo = document.querySelector('#local');
    const startCallButton = document.querySelector('#start-call');

    let webcamStream = null;

    window.getWebcam({ video: true, audio: false }).then(stream => {
        webcamStream = stream;
        window.attachStreamToVideo(stream, localVideo);
    });

    let callAnswered = false;

    startCallButton.addEventListener('click', startCall);

    function startCall() {
        startCallButton.style.display = 'none';

        const peer1 = new window.SimplePeer({ initiator: true, stream: webcamStream });

        peer1.on('signal', sdp => {
            if (callAnswered) return;
        });

        function callAnswered(remoteSdp) {
            peer1.signal(remoteSdp);
            callAnswered = true;
        }

        peer1.on('stream', stream => {
            window.attachStreamToVideo(stream, remoteVideo);
        });
    }

    function answerCall() {
        startCallButton.style.display = 'none';

        const peer2 = new window.SimplePeer({ initiator: false,  stream: webcamStream });

        peer2.signal(remoteSdp);
        peer2.on('signal', sdp => {

        });

        peer2.on('stream', stream => {
            window.attachStreamToVideo(stream, remoteVideo)
        })
    }
});
