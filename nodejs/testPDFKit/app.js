const Jimp = require("jimp");
const PNG = require("pngjs").PNG;
const StreamToBuffer = require("stream-to-buffer");

// open a file called "lenna.png"
// Jimp.read("./res/Template_A4.png", function (err, lenna) {
//     if (err) throw err;
//     lenna.resize(256, 256)            // resize
//          .quality(60)                 // set JPEG quality
//          .greyscale()                 // set greyscale
//          .write("lena-small-bw.jpg"); // save
// });

Jimp.prototype.getBuffer = function (mime, cb) {
    console.log("my buffer3");
    if (mime === Jimp.AUTO) { // allow auto MIME detection
        mime = this.getMIME();
    }

    if (typeof mime !== "string")
        return throwError.call(this, "mime must be a string", cb);
    // if (typeof cb !== "function")
    //     return throwError.call(this, "cb must be a function", cb);

    return new Promise((resolve, reject) => {
        cb = cb || function (err, buffer) {
            if (err) reject(err);
            else resolve(buffer);
        }
        switch (mime.toLowerCase()) {
            case Jimp.MIME_PNG:
                var that = this;
                var png = new PNG({
                    width: this.bitmap.width,
                    height: this.bitmap.height,
                    bitDepth: 8,
                    deflateLevel: this._deflateLevel,
                    deflateStrategy: this._deflateStrategy,
                    filterType: this._filterType,
                    colorType: (this._rgba) ? 6 : 2,
                    inputHasAlpha: true
                });

                if (this._rgba) png.data = new Buffer(this.bitmap.data);
                else png.data = compositeBitmapOverBackground(this).data; // when PNG doesn't support alpha

                StreamToBuffer(png.pack(), function (err, buffer) {
                    return cb.call(that, null, buffer);
                });
                break;

            case Jimp.MIME_JPEG:
                // composite onto a new image so that the background shows through alpha channels
                var jpeg = JPEG.encode(compositeBitmapOverBackground(this), this._quality);
                return cb.call(this, null, jpeg.data);

            case Jimp.MIME_BMP:
            case Jimp.MIME_X_MS_BMP:
                // composite onto a new image so that the background shows through alpha channels
                var bmp = BMP.encode(compositeBitmapOverBackground(this));
                return cb.call(this, null, bmp.data);

            case Jimp.MIME_TIFF:
                var c = compositeBitmapOverBackground(this)
                var tiff = UTIF.encodeImage(c.data, c.width, c.height);
                return cb.call(this, null, new Buffer(tiff));

            default:
                return cb.call(this, "Unsupported MIME type: " + mime);
        }

    });
};


function getRandNum(max, min) {
    min = min === undefined ? 5 : min;
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandOperator(fullSet) {
    return fullSet[Math.floor(Math.random() * fullSet.length)];
}



function generateProblem(operandNum, maxOperand, allowBlank) {
    let operands = [];
    let operators = [];
    let allOperator = ["+", "-"];
    let placeholder = `(      )`;
    // let interOperand;
    let leftOperand, rightOperand;
    for (let i = 0; i < operandNum - 1; i++) {
        let operator = getRandOperator(allOperator);
        if (i === 0) {
            leftOperand = getRandNum(maxOperand, 40);
            operands.push(leftOperand);
        }
        switch (operator) {
            case "-":
                rightOperand = getRandNum(Math.min(maxOperand, leftOperand));
                if (leftOperand > rightOperand) {
                    leftOperand = leftOperand - rightOperand;
                } else {
                    operator = "+";
                    leftOperand = leftOperand + rightOperand;
                }
                break;
            case "+":
                rightOperand = getRandNum(maxOperand - leftOperand);
                leftOperand = leftOperand + rightOperand;

                break;
            default:
        }
        operands.push(rightOperand);
        operators.push(operator);
    }
    operands.push(leftOperand);
    operators.push('=');
    // console.log(operands);
    // console.log(operators);
    let placeholderPosition = !!allowBlank ? getRandNum(operandNum + 1, 0) : operandNum;
    // console.log("position="+placeholderPosition);
    let aResult = [];
    for (let i = 0; i < operands.length; i++) {
        if (placeholderPosition === i) {
            aResult.push(placeholder)
        } else {
            aResult.push(operands[i]);
        }
        if (i < operators.length) {
            aResult.push(operators[i]);
        }
    }
    return aResult.join(" ");
}


async function printProblem(template, name, date, output, aOperandNum, maxOperand, allowBlank) {
    try {
        console.log("before read");
        let image = await Jimp.read(template);
        console.log("before load");
        let zh_font = await Jimp.loadFont('./res/fonts/Yahei_32_Black/Yahei.fnt');
        image.print(zh_font, 305, 62, name);
        image.print(zh_font, 565, 62, date);

        let HLen = 621;
        let VLen = 64;
        let x0 = 232;
        let y0 = 289;
        let sans_font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 25; j++) {
                let operandNum = aOperandNum[getRandNum(aOperandNum.length, 0)];
                image.print(sans_font, x0 + i * HLen, y0 + j * VLen, generateProblem(operandNum, maxOperand, allowBlank));
            }
        }

        console.log("before Write");
        // image.getBuffer(Jimp.AUTO, function (err,buf) {
        //     console.log("inside getBuffer");
        //     callback(buf);
        // });
        return await image.getBuffer(Jimp.AUTO);
        console.log("After Write");

    } catch (error) {
        console.log(error);
    }
}

// printProblem(template, name, date);
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser')

app.use(bodyParser());
app.use(async ctx => {
    let config = ctx.request.query;
    let template = "./res/Template_A4.png";
    let outputfile = "./output/" + "adsf" + ".png";

    let maxOperand;
    if (config.level === "0") {
        maxOperand = 20;
    } else if (config.level === "1") {
        maxOperand = 100;
    }
    let aOperandNum = [];
    let allowBlank = false;

    switch (config.options) {
        case "0":
            aOperandNum.push(2);
            break;
        case "1":
            aOperandNum.push(2);
            aOperandNum.push(3);
            break;
        case "2":
            aOperandNum.push(2);
            aOperandNum.push(3);
            allowBlank = true;
            break;
    }

    console.log("====Before print====");
    let buf = await printProblem(template, config.name, config.date, outputfile, aOperandNum, maxOperand, allowBlank);
    console.log("====After print====");
    let filename = encodeURI(config.name) + "_" + config.date + ".png";
    ctx.set('Content-disposition', 'attachment; filename=' + filename);
    ctx.set('Content-type', 'image/png')

    const fs = require('fs');
    // ctx.body = fs.readFileSync(outputfile);
    ctx.body = buf;

    console.log("Before while");
    // while(!ctx.body){
    //     var i = 1;
    // }
});
app.listen(3000);