/**
 * Cross browser method of getting access to a users webcam
 * @param constraintsObj standard getUserMedia constraints object
 * @returns {Promise} Promise's then callback will be passed a stream object
 */
function getWebcam(constraintsObj) {
    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {

            // First get ahold of the legacy getUserMedia, if present
            const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            // Some browsers just don't implement it - return a rejected promise with an error
            // to keep a consistent interface6
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }

            // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            return new Promise((resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
    }

    return navigator.mediaDevices.getUserMedia(constraintsObj);
}

/**
 * Cross browser method of attaching stream from getUserMedia to a video tag
 * @param {getUserMedia.stream} stream Stream from getUserMedia
 * @param {HTMLElement} videoEl Reference to a video tag in the DOM
 */
function attachStreamToVideo(stream, videoEl) {
    console.log({stream, videoEl});
    // Older browsers may not have srcObject
    if ('srcObject' in videoEl) {
        videoEl.srcObject = stream;
    } else {
        // Avoid using this in new browsers, as it is going away.
        videoEl.src = window.URL.createObjectURL(stream);
    }

    videoEl.play();
}