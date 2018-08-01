const Tesseract = require('tesseract.js');
const path = require('path');


//var imgPath = path.join(__dirname, './img/Snipaste_2018-08-01_08-43-24.png');
var imgPath = path.join(__dirname, './img/30.jpg');

Tesseract.recognize(imgPath)
    .then(function(result){
	console.log(result);
    });


