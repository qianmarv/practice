const sharp = require('sharp');
const path = require("path");

// const FONT_ZH_32_BLACK = path.join(__dirname, './resources/fonts/Yahei_32_Black/Yahei.fnt');
const TEMPLATE_A4 = path.join(__dirname, "../resources/template/Template_A4.png");

function getRandNum(max, min) {
    min = min === undefined ? 5 : min;
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandOperator(fullSet) {
    return fullSet[Math.floor(Math.random() * fullSet.length)];
}

function genEquation(operandNum, maxOperand, allowBlank) {
    let operands = [];
    let operators = [];
    let allowedOperator = ["+", "-"];
    let placeholder = `(        )`;
    // let interOperand;
    let leftOperand, rightOperand;
    for (let i = 0; i < operandNum - 1; i++) {
        let operator = getRandOperator(allowedOperator);
        if (i === 0) {
            leftOperand = getRandNum(maxOperand, Math.floor(maxOperand/2));
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
    let aQuiz = [];
    let aAnswer = [];
    for (let i = 0; i < operands.length; i++) {
        if (placeholderPosition === i) {
            aQuiz.push(placeholder);
            if(operands[i]<10){
                aAnswer.push(`(   ${operands[i]}  )`)
            }else if(operands[i]<100){
                aAnswer.push(`(  ${operands[i]}  )`)
            }else if(operands[i]<1000){
                aAnswer.push(`(  ${operands[i]} )`)
            }
        } else {
            aQuiz.push(operands[i]);
            aAnswer.push(operands[i]);
        }
        if (i < operators.length) {
            aQuiz.push(operators[i]);
            aAnswer.push(operators[i]);
        }
    }
    return {
        quiz: aQuiz.join(" "),
        answer: aAnswer.join(" ")
    }
}

function genQuiz(aOperandNum, maxOperand, allowBlank){
    let aResult = [];
    for (let i = 0; i < 50; i++) {
        let operandNum = aOperandNum[getRandNum(aOperandNum.length, 0)];
        aResult.push(genEquation(operandNum, maxOperand, allowBlank));
    }
    return aResult;
}


const printQuiz = async function (name, date, quiz) {
    const image = sharp(TEMPLATE_A4);
    const metadata = await image.metadata();
    let   sSVG  = '';

    const pos_name = {x: 300, y: 90};
    const pos_date = {x: 560, y: 90};

    // SVG Start
    sSVG += `<?xml version="1.0" encoding="UTF-8"?>`
    sSVG += `<svg width="${metadata.width}" height="${metadata.height}">`;
    //Print Name
    sSVG += `<text x="${pos_name.x}" y= "${pos_name.y}" style="font-family:SimSun; 
                                          font-size: 32px;">${name}</text>`
    //Print Date
    sSVG += `<text x="${pos_date.x}" y= "${pos_date.y}" style="font-family:SimSun; 
                                          font-size: 32px;">${date}</text>`

   //Print Quiz
    const pos_quiz = {x: 240, y: 290};
    const size_quiz = {w: 620, h: 64};

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 25; j++) {
            let v = quiz[i*25+j].quiz;
            sSVG += `<text x="${pos_quiz.x + i * size_quiz.w}" 
                           y="${pos_quiz.y + j*size_quiz.h}" 
                           xml:space="preserve" 
                           style="font-family:Arial;
                                  font-size: 32px;">${v}</text>`
        }
    }
   // SVG End
    sSVG += `</svg>` 
    return await image.overlayWith(Buffer.from(sSVG))
               .toBuffer( );
}

//

async function post(ctx, next) {
}

async function get(ctx ) {
//    if (ctx.state.$wxInfo.loginState === 1) {
//         // loginState 为 1，登录态校验成功
//         ctx.state.data = ctx.state.$wxInfo.userinfo
    // } else {
        // ctx.state.code = -1
        // return;
    // }

    // let userInfo = ctx.state.data;
    let config = ctx.request.query;
    // let outputfile = "../uploaded/"+userInfo.openId+".png";
    let maxOperand;
    config.allowBlank = config.allowBlank === "true" ? true : false;
    if(config.level === "0"){
        maxOperand = 20;
    }else if(config.level === "1"){
        maxOperand = 100;
    }
    let aOperandNum = [];

    if(typeof config.options === "object"){
        if(config.options.indexOf("0") !== -1){
            aOperandNum.push(2);
        }
        if(config.options.indexOf("1") !== -1){
            aOperandNum.push(3);
        }
    } else {
        switch (config.options) {
            case "0":
                aOperandNum.push(2);
                break;
            case "1":
                aOperandNum.push(2);
                aOperandNum.push(3);
                break;
       }
    }
    let quiz = genQuiz(aOperandNum, maxOperand, config.allowBlank);
    let buf = await printQuiz(config.name, config.date, quiz);

    let filename = encodeURI(config.name) + "_" + config.date + ".png";
    ctx.set('Content-disposition', 'attachment; filename=' + filename);
    ctx.set('Content-type', 'image/png')
    // const fs = require('fs');
    ctx.body = buf;

}

module.exports = {
    get,
    post
}