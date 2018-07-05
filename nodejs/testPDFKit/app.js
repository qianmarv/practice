const Jimp = require("jimp");

// open a file called "lenna.png"
// Jimp.read("./res/Template_A4.png", function (err, lenna) {
//     if (err) throw err;
//     lenna.resize(256, 256)            // resize
//          .quality(60)                 // set JPEG quality
//          .greyscale()                 // set greyscale
//          .write("lena-small-bw.jpg"); // save
// });

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
        if( i === 0){
            leftOperand = getRandNum(maxOperand, 40);
            operands.push(leftOperand);
        }
        if (operator === "-") {
            rightOperand = getRandNum(Math.min(maxOperand, leftOperand));
            if(leftOperand > rightOperand){
                leftOperand = leftOperand - rightOperand;
            }else{
                operator = "+";
                leftOperand = leftOperand + rightOperand;
            }
        } else {
            rightOperand = getRandNum(maxOperand);
            leftOperand = leftOperand + rightOperand;
        }
        operands.push(rightOperand);
        operators.push(operator);
    }
    operands.push(leftOperand);
    operators.push('=');
    // console.log(operands);
    // console.log(operators);
    let placeholderPosition = !!allowBlank ? getRandNum(operandNum + 1,0) : operandNum;
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


async function printProblem(template, name, date) {
    try {
        let image = await Jimp.read(template);
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
                let operandNum = getRandNum(4,2);
                image.print(sans_font, x0 + i * HLen, y0 + j * VLen, generateProblem(operandNum,100,true));
            }
        }

        image.write("./output/test.png");

    } catch (error) {
        console.log(error);
    }
}

let template = "./res/Template_A4.png";
let name = '钱煜森';
let date = "2018-07-05";

printProblem(template, name, date);