document.addEventListener('DOMContentLoaded', () => {

    const remoteVideo = document.querySelector('#remote');
    const localVideo = document.querySelector('#local');
    const startCallButton = document.querySelector('#start-call');

    let webcamStream = null;

    window.getWebcam({ video: true, audio: false }).then(stream => {
        webcamStream = stream;
        window.attachStreamToVideo(stream, localVideo);
    });

    startCallButton.addEventListener('click', startCall);

    function startCall() {
        startCallButton.style.display = 'none';

    }

    function answerCall() {

    }
});
