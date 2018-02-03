// Incredental Replace expression
function xxx(sExp){
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


function calc(sExpr){
    console.log(LDR(buildBTree(sExpr.replace(/ /g,""))));
}

/*
 *Another Implmentation without using Regular Expression
 *
 *
 *
 */

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
function calc3(sExpr){
    buildSmartTree(sExpr.replace(/ /g,""));
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
                    let [iLen, preOpr,curOpr] = [aResult.length, aResult[aResult.length - 3], aResult[aResult.length - 1]];
                    if ((curOpr === "*" || curOpr === "/") && (preOpr === "+" || preOpr === "-")) {  //Draw back for high priority operator
                        vOpr = [aResult[iLen - 2], aResult[aResult.length - 1], vOpr];
                        aResult = aResult.slice(0, iLen - 2);          // Draw back
                    } else {
                        aResult = [aResult.slice(0, iLen - 1), curOpr];  //Promote
                    }
                }
            }
            aResult.push(vOpr);
            break; // Match once
        }
    }
    if(!aNewStates) return [];  //not in loop, invalid expression
    return sSub === "" ? aResult: buildBTreeWOReg(sSub, aNewStates, aResult);
}
function calc2(sExpr){
    LDR(buildBTreeWOReg(sExpr.replace(/ /g,"")));
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

/*
 *
 * Scan Express String
 * 1. Treat paren as whole part equal to operand & do recuisive
 * 2. Build Tree, while calculating next operator, check priority
 *    If second pri. is low, then do the calc, else calc second part back to 1
 * 3. If string is empty, finish the loop/recuisive
 */
// Without Regular Expression
function mixCalc(sExpr){
    let currState, token;
    for (let i=0, iLen=sExpr.length; i<iLen; i++){
        if(!isNaN(sExpr[i])){ //Number
            for (let j=0; j<iLen && !isNaN(sExpr[j]); j++){ //TODO Support float
            }
            token = sExpr.substring(i,j);
        } else if(sExpr[i] === '*' || sExpr[i] === '/' || sExpr[i] === '+' || sExpr[i] === '-'){
        }
    }
    buildTinyTree(sExpr, sSub);
};
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
function buildTinyTree(sStr, aNextStates=["N", "("], aResult=[]) {
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
                    let [iLen, preOpr,curOpr] = [aResult.length, aResult[aResult.length - 3], aResult[aResult.length - 1]];
                    if ((curOpr === "*" || curOpr === "/") && (preOpr === "+" || preOpr === "-")) {  //Draw back for high priority operator
                        vOpr = [aResult[iLen - 2], aResult[aResult.length - 1], vOpr];
                        aResult = aResult.slice(0, iLen - 2);          // Draw back
                    } else {
                        aResult = [aResult.slice(0, iLen - 1), curOpr];  //Promote
                    }
                }
            }
            aResult.push(vOpr);
            break; // Match once
        }
    }
    if(!aNewStates) return [];  //not in loop, invalid expression
    return sSub === "" ? aResult: buildBTreeWOReg(sSub, aNewStates, aResult);
}
function LDRCalc(vTree){
    if(Array.isArray(vTree)){ // Tree Node
        let [l, op, r] = [LDRCalc(vTree[0]), aTree[1], LDRCalc(aTree[2])];
        switch(op){
        case "+": return l + r;
        case "-": return l - r;
        case "*": return l * r;
        case "/": return l / r;
        default:  return NaN;
        }
    } else if(!isNaN(Number(vTree))){ // Number, Leaf
        return Number(vTree);
    } else {   //Not interpreted string
        return buildTinyTree(vTree);
    }
}

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

function pf2(fCalc){
    let sExpr = [
        "1+1",
        "5+(2*3)",
        "3+(2-4*9)",
        "3*(5-(5-2*(5-(9-(5*(58-8))))))",
        "3*(8-(5-2*(5-(9-(5*(58-8))))))",
        "3*(9-(5-2*(5-(9-(5*(58-8))))))",
        "3*(2-(5-2*(3/5)))",
        "9+1",
        "9+(2*3)",
        "9+(2-4*9)",
        "9*(5-(5-2*(5-(9-(5*(58-8))))))",
        "9*(8-(5-2*(5-(9-(5*(58-8))))))",
        "9*(9-(5-2*(3/5)))",
        "9*(2-(5-2*(5-(9-(5*(58-8))))))",
        "8+1",
        "8+(2*3)",
        "8+(2-4*9)",
        "8*(5-(5-2*(5-(9-(5*(58-8))))))",
        "8*(8-(5-2*(5-(9-(5*(58-8))))))",
        "8*(9-(5-2*(3/5)))",
        "8*(2-(5-2*(5-(9-(5*(58-8))))))",
        "8+1",
        "8+(2*3)",
        "8+(2-4*9)",
        "102*(5-(5-2*(8/5)))",
        "102*(8-(5-2*(5-(9-(5*(58-8))))))",
        "102*(9-(5-2*(5-(9-(5*(58-8))))))",
        "102*(2-(5-2*(5-(9-(5*(58-8))))))",
        "102+1",
        "102+(2*3)",
        "102+(2-4*9)",
        "102*(5-(5-2*(5-(9-(5*(58-8))))))",
        "102*(8-(5-2*(5-(9-(5*(58-8))))))",
        "102*(9-(5-2*(5-(9-(5*(58-8))))))",
        "102*(2-(5-2*(3/5)))",
        "102+1",
        "102+(2*3)",
        "102+(2-4*9)",
        "102*(5-(5-2*(5-(9-(5*(58-8))))))",
        "102*(8-(5-2*(5-(9-(5*(58-8))))))",
        "102*(9-(5-2*(3/5)))",
        "102*(2-(5-2*(5-(9-(5*(58-8))))))",
        "102+1",
        "102+(2*3)",
        "102+(2-4*9)",
        "102*(5-(5-2*(5-(9-(5*(58-8))))))",
        "102*(8-(5-2*(5-(9-(5*(58-8))))))",
        "102*(9-(5-2*(3/5)))",
        "102*(2-(5-2*(5-(9-(5*(58-8))))))",
        "102+1",
        "102+(2*3)",
        "102+(2-4*9)",
        "102*(5-(5-2*(8/5)))",
        "102*(8-(5-2*(5-(9-(5*(58-8))))))",
        "102*(9-(5-2*(5-(9-(5*(58-8))))))",
        "102*(2-(5-2*(5-(9-(5*(58-8))))))"
    ];

    console.time('Marvin');
    for(let i=0; i<sExpr.length; i++){
        fCalc.apply(null,sExpr);
    }
    console.timeEnd('Marvin');
}

 /*
  * Could leverate generator ?
  * scan
  *
  *
  *
  */
function hasHigherPri(op1, op2){
    if((op1=="*" || op1=="/") && ((op2 ==undefined || op2=="+" || op2=="-"))){
        return true;
    }
    if((op1=="+" || op1=="-") && (op2=="+")){
        return true;
    }
    return false;
};

function zzz(l, op, r) {
    [l,r].map((v)=>{Number(v)});
    switch(op){
    case "+": return l + r;
    case "-": return l - r;
    case "*": return l * r;
    case "/": return l / r;
    };
};

function mixCalc2(sExpr){
    // trim blanks

    // directly return if it's number;
    if(!isNaN(Number(sExpr))) { return Number(sExpr); }
    let pre, cur, vNode, aNode=[];
    for(let i=0, iLen=sExpr.length; i<iLen; i++){
        vNode = sExpr[i];
        switch(vNode){
        case "(":
            //Matching right paren and recursive call
            let count = 1;
            for (let j=i+1; j<iLen && count!=0; j++){
                if(sExpr[j] === '(') count++;
                else if(sExpr[j] === ')') count--;
                if(count ===0){
                    vNode = mixCalc2(sExpr.substring(i+1, j)); // strip parenthesis
                    i = j;
                    break;
                }
            }
            if(count!==0)throw "Parenthesis not Matching!";
            aNode.push(vNode);
            break;
        case "*":
        case "/":
        case "+":
        case "-":
            [pre, cur] = [cur, vNode];
            break;
        default:
            if(!isNaN(Number(vNode))){ // a number
                let j=i+1;
                for(;j<iLen; j++){
                    if(isNaN(Number(sExpr[j]))){
                        break;
                    }
                }
                vNode = Number(sExpr.substring(i,j));
                i = j-1;

                if(hasHigherPri(cur, pre)){
                    let [r, op, l] = [vNode, cur, aNode.pop()];
                    vNode = zzz(l, op, r);
                    cur = pre;
                }else if(typeof pre !== 'undefined'){            // if pre oprand exists, could run it now.
                    aNode = [zzz(aNode[0],pre,aNode[1])];
                }
                aNode.push(vNode);
            } else {
                throw "Invalid Symbole: " + vNode;
            }
        }
    }
    return aNode.length===1 ? aNode[0]: zzz(aNode[0], cur, aNode[1]);
};
