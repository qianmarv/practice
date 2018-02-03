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
    mixModeArithmetic('5+  ((15+  15)   * 4 )-3');
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
    mixModeArithmetic('5+  ((15+  15)   * 4 )-3');
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
    mixModeArithmetic('5+  ((15+  15)   * 4 )-3');
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
    mixModeArithmetic('5+  ((15+  15)   * 4 )-3');
    mixModeArithmetic('5+ 6 + 2*3*6/4 - 8 + 1');
    console.timeEnd('Marvin');
//}

/**
 * Mix Mode Arithmetic
 * @param arithExpr: Arithmetic Expression String
 * (1+2)*(3+4)
 */
function mixModeArithmetic(sExpr){
    var result = {value: 0, isSyntaxError: false, position: 0};

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
    mixCalc2(sExpr.replace(/ /g,""));
};
