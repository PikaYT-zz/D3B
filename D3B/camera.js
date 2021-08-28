const video = document.querySelector('#camera-stream');
const hiddenCanvas = document.querySelector('#hidden-canvas');
const outputCanvas = document.querySelector('#output-canvas');
const hiddenContext = hiddenCanvas.getContext('2d');
const outputContext = outputCanvas.getContext('2d');

const constraints = {
    video: {
        width: 512,
        height: 512,
    },
};

const getAverageRGB = (frame) => {
    const length = frame.data.length / 4;

    let r = 0;
    let g = 0;
    let b = 0;

    for (let i = 0; i < length; i++) {
        r += frame.data[i * 4 + 0];
        g += frame.data[i * 4 + 1];
        b += frame.data[i * 4 + 2];
    }

    return {
        r: r / length,
        g: g / length,
        b: b / length,
    };
};

//const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&()/\\+<>';
const charset = 'D3B';

const processFrame = () => {
    const fontHeight = 12;
    const { videoWidth: width, videoHeight: height } = video;

    if (width && height) {
        hiddenCanvas.width = width;
        hiddenCanvas.height = height;
        outputCanvas.width = width;
        outputCanvas.height = height;
        hiddenContext.drawImage(video, 0, 0, width, height);

        outputContext.textBaseline = 'top';
        outputContext.font = `${fontHeight}px Consolas`;

        const text = outputContext.measureText('@');
        const fontWidth = parseInt(text.width);

        outputContext.clearRect(0, 0, width, height);

        for (let y = 0; y < height; y += fontHeight) {
            for (let x = 0; x < width; x += fontWidth) {
                const frameSection = hiddenContext.getImageData(x, y, fontWidth, fontHeight);
                const { r, g, b } = getAverageRGB(frameSection);
                const randomCharacter = charset[Math.floor(Math.random() * charset.length)];
                if (r, g, b != 0) {
                    outputContext.fillStyle = `rgb(${r},${g},${b})`;
                    //outputContext.fillStyle = `rgb(${0},${g},${0})`;
                    //outputContext.fillRect(x, y, fontWidth, fontHeight);
                    outputContext.fillText(randomCharacter, x, y);
                } else {
                    //console.log("Ignored!")
                }
            }
        }
    }

    window.requestAnimationFrame(processFrame);
};

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
            video: true
        })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.error(err);
        });
}

// navigator.mediaDevices.getUserMedia(constraints, function(stream) {
//     video.srcObject = stream;
//     video.play();
// }, function(err) {
//     console.error(err);
// });

video.addEventListener('play', function() {
    window.requestAnimationFrame(processFrame);
    console.log('Live!');
});


// const video = document.querySelector('#videoElement');
// const hiddenCanvas = document.querySelector('#hidden-canvas');
// const outputCanvas = document.querySelector('#output-canvas');
// const hiddenContext = hiddenCanvas.getContext('2d');
// const outputContext = outputCanvas.getContext('2d');

// const processFrame = () => {
//     const { videoWidth: width, videoHeight: height } = video;
//     const fontHeight = 12;

//     if (width && height) {
//         hiddenCanvas.width = width;
//         hiddenCanvas.height = height;
//         outputCanvas.width = width;
//         outputCanvas.height = height;
//         hiddenContext.drawImage(video, 0, 0, width, height);

//         outputContext.textBaseline = 'top';
//         outputContext.font = `${fontHeight}px Consolas`;

//         const text = outputContext.measureText('@');
//         const fontWidth = parseInt(text.width);

//         // get frame from hiddenContext
//         // apply filter
//         // draw outputContext
//     }

//     window.requestAnimationFrame(processFrame);
// };

// if (navigator.mediaDevices.getUserMedia) {
//     navigator.mediaDevices.getUserMedia({
//             video: true
//         })
//         .then(function(stream) {
//             video.srcObject = stream;
//         })
//         .catch(function(err0r) {
//             console.log("Something went wrong!");
//         });
// }



// function stop(e) {
//     var stream = video.srcObject;
//     var tracks = stream.getTracks();

//     for (var i = 0; i < tracks.length; i++) {
//         var track = tracks[i];
//         track.stop();
//     }

//     video.srcObject = null;
//}