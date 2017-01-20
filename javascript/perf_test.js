/**
 * Created by VinceZK on 1/17/17.
 */
//for(let i=0; i<10; i++){
    console.time('Marvin');
    mixModeArithmetic( '(1+2)*3');
    mixModeArithmetic( '(1+2)*30');
    mixModeArithmetic( '(1+2)*(3+4)');
    mixModeArithmetic( '(1+2)*(3+4)/7');
    mixModeArithmetic( '      1+2*3+4');
    mixModeArithmetic( '(1+2*3+4/2)/3');
    mixModeArithmetic( '((1+2*3+4/2)/3+2)*4');
    mixModeArithmetic('5*(1+2*3+2)');
    mixModeArithmetic('5+((1+2)*4)-3');
    mixModeArithmetic('5+  ((1.5+  1.5)   * 4 )-3');
    mixModeArithmetic('5+ 6 + 2*3*6/4 - 8 + 1');
    mixModeArithmetic( '(1+2)*3');
    mixModeArithmetic( '(1+2)*30');
    mixModeArithmetic( '(1+2)*(3+4)');
    mixModeArithmetic( '(1+2)*(3+4)/7');
    mixModeArithmetic( '      1+2*3+4');
    mixModeArithmetic( '(1+2*3+4/2)/3');
    mixModeArithmetic( '((1+2*3+4/2)/3+2)*4');
    mixModeArithmetic('5*(1+2*3+2)');
    mixModeArithmetic('5+((1+2)*4)-3');
    mixModeArithmetic('5+  ((1.5+  1.5)   * 4 )-3');
    mixModeArithmetic('5+ 6 + 2*3*6/4 - 8 + 1');
    mixModeArithmetic( '(1+2)*3');
    mixModeArithmetic( '(1+2)*30');
    mixModeArithmetic( '(1+2)*(3+4)');
    mixModeArithmetic( '(1+2)*(3+4)/7');
    mixModeArithmetic( '      1+2*3+4');
    mixModeArithmetic( '(1+2*3+4/2)/3');
    mixModeArithmetic( '((1+2*3+4/2)/3+2)*4');
    mixModeArithmetic('5*(1+2*3+2)');
    mixModeArithmetic('5+((1+2)*4)-3');
    mixModeArithmetic('5+  ((1.5+  1.5)   * 4 )-3');
    mixModeArithmetic('5+ 6 + 2*3*6/4 - 8 + 1');
    mixModeArithmetic( '(1+2)*3');
    mixModeArithmetic( '(1+2)*30');
    mixModeArithmetic( '(1+2)*(3+4)');
    mixModeArithmetic( '(1+2)*(3+4)/7');
    mixModeArithmetic( '      1+2*3+4');
    mixModeArithmetic( '(1+2*3+4/2)/3');
    mixModeArithmetic( '((1+2*3+4/2)/3+2)*4');
    mixModeArithmetic('5*(1+2*3+2)');
    mixModeArithmetic('5+((1+2)*4)-3');
    mixModeArithmetic('5+  ((1.5+  1.5)   * 4 )-3');
    mixModeArithmetic('5+ 6 + 2*3*6/4 - 8 + 1');
    console.timeEnd('Marvin');
//}

/**
 * Mix Mode Arithmetic
 * @param arithExpr: Arithmetic Expression String
 * (1+2)*(3+4)
 */
function mixModeArithmetic1(sExpr){
    var result = {value: 0, isSyntaxError: false, position: 0};
    function calculator(l, op, r){
        l = Number(l);
        r = Number(r);
        switch(op){
        case "+": return l + r;
        case "-": return l - r;
        case "*": return l * r;
        case "/": return l / r;
        default:  return NaN;
        }
    }

    function getToken(sExpr, tokenType, sToken="", i=0){
        switch(tokenType){
        case 'N':
            for(i=0,len=sExpr.length;i<len && !isNaN(sExpr[i]);i++){
                sToken = sToken + sExpr[i];
            }
            break;
        case '(':
            [sToken, i] = function(sStr, count=1){ // Match right parenthesis
                for (let i=1,len=sStr.length; i<=len; i++){
                    if(count === 0){
                        return [sStr.slice(1,i-1),i];
                    }
                    if(sStr[i] === '(') count++;
                    if(sStr[i] === ')') count--;
                }
                return ["",-1]; // failed maching TODO throw exception
            }(sExpr);
            break;
        case 'O':
            sToken = sExpr[i] === "+" || sExpr[i] ==="-" || sExpr[i] === "*" || sExpr[i] ==="/" ? sExpr[i++] : "";
        default:
        }
        return sToken === "" ? [] : [sToken, sExpr.slice(i, sExpr.length)];
    }

    function buildSmartTree(sStr, aNextStates=["N", "("], aResult=[]) {
        let aNewStates, vOpr, sSub;
        let oPri = {
            "+" : 1,
            "-" : 1,
            "*" : 5,
            "/" : 5
        };
        for (let i = 0; i < aNextStates.length; i++) { // Check Next Possible State
            let sState = aNextStates[i];
            [vOpr, sSub] = getToken(sStr, sState);
            if(vOpr) {
                if (sState === "O") aNewStates = ["N", "("];  // Operator
                else {  // Operand
                    aNewStates = ["O"];
                    if (sState === "(") vOpr = buildSmartTree(vOpr);
                    if (aResult.length > 3) {
                        let [iLen, preOpr,curOpr] = [aResult.length, aResult[aResult.length - 3], aResult[aResult.length - 1]];
                        if (oPri[curOpr] > oPri[preOpr]) {  //Draw back for high priority operator
                            // Could be Calcuated now
                            vOpr = calculator(aResult[iLen - 2], aResult[aResult.length - 1], vOpr);
                            aResult = aResult.slice(0, iLen - 2);          // Draw back
                        } else {
                            aResult = [calculator(aResult[0], aResult[1], aResult[2]), curOpr];  //Promote
                        }
                    }
                }
                aResult.push(vOpr);
                break; // Match once
            }
        }
        if(!aNewStates) return [];  //not in loop, invalid expression
        return sSub === "" ? calculator(aResult[0], aResult[1], aResult[2]): buildSmartTree(sSub, aNewStates, aResult);
    }


    result.value = buildSmartTree(sExpr.replace(/ /g,""));
    return result;
}

function mixModeArithmetic(sExp){
    sExp = sExp.replace(/ /g,""); // remove blank
    var reNum    = /DUMMY|\d+[\.\d+]?/;
    var reParen  = /\((\d+|DUMMY)[\+\-\*\/](\d+|DUMMY)\)/; // match inside paren
    var reMulDiv = /(\d+|DUMMY)[*/](\d+|DUMMY)/;         // match first * /
    var rePlsSub = /(\d+|DUMMY)[+-](\d+|DUMMY)/;         // match first + -
    var vDummy;
    function dummyCalc(sExp){
        var sOp     = sExp.match( /[\+\-\*\/]/ );
        var aNum    = sExp.split(sOp);
        aNum[0] = aNum[0] === 'DUMMY' ? vDummy : Number(aNum[0]);
        aNum[1] = aNum[1] === 'DUMMY' ? vDummy : Number(aNum[1]);
        try{
            switch(sOp[0]){
            case "+": vDummy = aNum[0] + aNum[1]; break;
            case "-": vDummy = aNum[0] - aNum[1]; break;
            case "*": vDummy = aNum[0] * aNum[1]; break;
            case "/": vDummy = aNum[0] / aNum[1]; break;
            default:  vDummy = NaN;
            }
        }catch (e){
            return NaN;
        }
        return 'DUMMY';
    };
    function calc(exp){
        //if(exp === 'DUMMY') exp = vDummy;
        return typeof exp === "number" || exp === 'DUMMY' ? exp : calc(function(){
            var subExp;
            if(reParen.test(exp)){
                subExp = exp.replace(reParen, function(v){
                    return calc(v.slice(1,v.length-1), true);
                });
            } else if(reMulDiv.test(exp)){
                subExp = exp.replace(reMulDiv, function(v){
                    return dummyCalc(v);
                });
            } else if(rePlsSub.test(exp)){
                subExp = exp.replace(rePlsSub, function(v){
                    return dummyCalc(v);
                });
            } else {
                return Number(exp);
            }
            return subExp;
//            console.log("Temp: " + subExp);
//            return isNaN(Number(subExp)) ? subExp : Number(subExp);
        }());
    };

    return calc(sExp) === 'DUMMY' ? vDummy : NaN;
};
