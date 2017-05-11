var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 1;
var camInterval = 1000 / camFps;

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;

// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function (socket) {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      const ts = new Date().toLocaleTimeString();

      im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
        if (err) throw err;

        for (var i = 0; i < faces.length; i++) {
          face = faces[i];
          im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
        }
	  
	  if (faces.length > 0) {
	      // im.save("img-"+ts+".jpg");
	      console.log("captured");
	  } else {
	      console.log("NOT captured");
	  }

	  const font = "HERSEY_SIMPLEX";
	  const color = [ 128, 127, 0];
	  const scale = 1, thickness = 2;
	  const msg = ts;
	  const x = 10, y = 200;
	  im.putText(msg, x, y, font, color, scale, thickness);

          socket.emit('frame', { buffer: im.toBuffer() });
	});
	
    });
  }, camInterval);
};
