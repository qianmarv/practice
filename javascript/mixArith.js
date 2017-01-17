// Incredental Replace expression
function xxx(sExp){
    sExp = sExp.replace(/ /g,""); // remove blank
    var reNum    = /<NUM\>|([\-]?\d+[\.\d+]?)/;
    var reParen  = /\(\d+([\+\-\*\/]\d+)*\)/; // match inside paren
    var reMulDiv = /\d+([\*\/]\d+|)/;         // match first * /
    var rePlsSub = /\d+([\+\-]\d+)/;         // match first + -
    function dummyCalc(sExp){
        var aNum    = sExp.match( /\d+/g ).map(parseFloat);
        var sOp     = sExp.match( /[\+\-\*\/]/ );
        try{
            switch(sOp[0]){
            case "+": return aNum[0] + aNum[1];
            case "-": return aNum[0] - aNum[1];
            case "*": return aNum[0] * aNum[1];
            case "/": return aNum[0] / aNum[1];
            default:  return NaN;
            }
        }catch (e){
            return NaN;
        }
    };
    function calc(/* })(window);*/){
        return typeof exp === "number" ? exp : calc(function(){
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
            console.log("Temp: " + subExp);
            return isNaN(Number(subExp)) ? subExp : Number(subExp);
        }());
    };
    return calc(sExp);
};

function test(expr){
    expr = expr || "15+(93-(2-1)*7)*9";
    console.log(expr + ":");
    console.log("xxxx=" + xxx(expr));
    console.log("eval=" + eval(expr));
}



// 1. Match paren
// 1.1 Find, get what inside, and recuisive call 1
// 1.2 Not Find, goto 2
// 2. Match MulDiv
// 2.1 Find, calc
// 2.2 Not Find, goto 3
// 3. Match PlsSub
// 3.1 Find, calc
// 3.2 Not Find, return



// Sequentially read the string by matching regExp
//    - Match left paren / oprand
// Category matched token and build binary tree
// Pring the tree by WFS | get result by DFS algorithms
// Exceptional Case:
//    Nagetive / float

// Possible State:
// { N: operand, O: operator, L: Left parenthesis, R: Right paren}
function buildBTree(sStr, aNextStates=["N", "("], aResult=[]){
    let oState = {
        "N":/^[\-]?(\d+)(\.\d+)?/,
        "O":/^[\+\-\*\/]/,
        "(":/^\(/,
        "D":/^$/,  // Done
    };
    let aNewStates, vOpr, sSub;
    for(let i=0; i<aNextStates.length; i++){
        let [sState, re] = [aNextStates[i], oState[aNextStates[i]]];
        if(re.test(sStr)){
            if(sState === "O"){
                [vOpr,sSub] = [sStr.match(re)[0], sStr.replace(re,"")];
                aNewStates = ["N", "("]; // operand and left paren could be next state of operator
            } else{
                if(sState === "("){
                    [vOpr,sSub] = function(sStr, count=1){
                        for (let i=1,len=sStr.length; i<=len; i++){
                            if(count === 0){
                                return [sStr.slice(1,i-1),sStr.slice(i, len)];
                            }
                            if(sStr[i] === '(') count++;
                            if(sStr[i] === ')') count--;
                        }
                        return ""; // failed maching TODO throw exception
                    }(sStr);
                    vOpr = buildBTree(vOpr);
                } else {
                    [vOpr,sSub] = [sStr.match(re)[0], sStr.replace(re,"")];
                }
                aNewStates = ["O"]; //operator should right after operand
                let iLen = aResult.length;
                if(iLen>3){
                    let [preOpr,curOpr] = [aResult[iLen-3], aResult[iLen-1]];
                    if((curOpr === "*"||curOpr === "/") && (preOpr === "+"||preOpr === "-")){  //Draw back for high priority operator
                       vOpr = [ aResult[iLen-2] , aResult[aResult.length-1], vOpr ];
                        aResult = aResult.slice(0, iLen-2); // draw back
                    } else { // Promote
                       aResult = [aResult.slice(0,iLen-1), curOpr];
                    }
                }
            }
            aResult.push(vOpr);
            break; // match once only
        }
    }
    if(!aNewStates) return [];  //not in loop, invalid expression
    return sSub === "" ? aResult: buildBTree(sSub, aNewStates, aResult);
}

function calc(sExpr){
    console.log(LDR(buildBTree(sExpr.replace(/ /g,""))));
}

// Without Regular Expression
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
function buildBTreeWOReg(sStr, aNextStates=["N", "("], aResult=[]) {
    let aNewStates, vOpr, sSub;
    for (let i = 0; i < aNextStates.length; i++) { // Check Next Possible State
        let sState = aNextStates[i];
        [vOpr, sSub] = getToken(sStr, sState);
        if(vOpr) {
            if (sState === "O") aNewStates = ["N", "("];  // Operator
            else {  // Operand
                aNewStates = ["O"];
                if (sState === "(") vOpr = buildBTreeWOReg(vOpr);
                if (aResult.length > 3) {
                    let [iLen, preOpr,curOpr] = [aResult.length, aResult[iLen - 3], aResult[iLen - 1]];
                    if ((curOpr === "*" || curOpr === "/") && (preOpr === "+" || preOpr === "-")) {  //Draw back for high priority operator
                        Opr = [aResult[iLen - 2], aResult[aResult.length - 1], vOpr];
                        aResult = aResult.slice(0, iLen - 2);          // Draw back
                    } else {
                        aResult = [aResult.slice(0, iLen - 1), curOpr];  //Promote
                    }
                }
                aResult.push(vOpr);
            }
            break; // Match once
        }
    }
    if(!aNewStates) return [];  //not in loop, invalid expression
    return sSub === "" ? aResult: buildBTree(sSub, aNewStates, aResult);
}
function LDR(aTree){
    return !Array.isArray(aTree) ? Number(aTree) :
        function(l, op, r) {
            switch(op){
            case "+": return l + r;
            case "-": return l - r;
            case "*": return l * r;
            case "/": return l / r;
            default:  return NaN;
            }
        }(LDR(aTree[0]), aTree[1], LDR(aTree[2]));
};
function calc2(sExpr){
    console.log(LDR(buildBTreeWOReg(sExpr.replace(/ /g,""))));
}

function LDRDraw(aTree, iDeepth = 0){
    if(!Array.isArray(aTree)) {
        let spc = "";
        for (let i = 0; i< iDeepth; i++){
            spc = spc + "~";
        }
        console.log(spc+aTree);
        return;
    }
    LDRDraw(aTree[0], iDeepth + 1);
    LDRDraw(aTree[1], iDeepth + 1);
    LDRDraw(aTree[2], iDeepth + 1);
}

function MDRDraw(aTree, iDeepth = 0){
    if(!Array.isArray(aTree)) {
        let spc = "";
        for (let i = 0; i< iDeepth; i++){
            spc = spc + "~";
        }
        console.log(spc+aTree);
        return;
    }
    LDRDraw(aTree[1], iDeepth + 1);
    LDRDraw(aTree[0], iDeepth + 1);
    LDRDraw(aTree[2], iDeepth + 1);
}

// 1 + 2 - 3
// (1 + 2)
// -
// 3
//

// Finit Automata
function FA(sExpr){
}

// PF Test
function pf(sExpr, times){
    let start = Date.now();
    for(let i=0; i<times; i++){
        calc(sExpr);
    }
    let end = Date.now();
    console.log("Runtime(ms)`: "+(end-start).toString());
}
