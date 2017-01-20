/**
 * Created by VinceZK on 1/17/17.
 */
for(let i=0; i<10; i++){
    console.time('Vincent');
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
    console.timeEnd('Vincent');
}

/**
 * Mix Mode Arithmetic
 * @param arithExpr: Arithmetic Expression String
 * (1+2)*(3+4)
 */
function mixModeArithmetic(arithExpr)
{
    var exprParsingStack = [];
    exprParsingStack[0] = new btreeExpression();
    var currentExprIdx = 0, currentExpression = '';
    var syntaxError = false, preNonSpaceChar = '';
    var result = {value: 0, isSyntaxError: false, position: 0};
    for (var i = 0, len = arithExpr.length; i < len; i++) { // Parse string expression to binary tree expression
        currentExpression = exprParsingStack[currentExprIdx];
        var previousChar = (i === 0) ? ' ' : arithExpr[i - 1];
        if(previousChar !== ' ')preNonSpaceChar = previousChar; //Previous non-space character
        switch (arithExpr[i]) {
        case '*':
        case '/':
            if (!isNaN(preNonSpaceChar) && currentExpression.rightOperand) {
                // Cases like: 1+1*2, (1*2) should be processed first, the prior (1+1) should be re-constructed
                exprParsingStack[++currentExprIdx] = new btreeExpression();
                exprParsingStack[currentExprIdx].leftOperand = currentExpression.rightOperand;
                currentExpression.rightOperand = exprParsingStack[currentExprIdx];
                currentExpression = exprParsingStack[currentExprIdx];
            }
        case '+':
        case '-':
            if (preNonSpaceChar && isNaN(preNonSpaceChar) && preNonSpaceChar !== ')')syntaxError = true;
            else if (currentExpression.rightOperand) {
                while (currentExprIdx > 0 && //Remove duplicate tree nodes
                       currentExpression === exprParsingStack[currentExprIdx-1].rightOperand) {
                    currentExpression = exprParsingStack[currentExprIdx-1];
                    currentExprIdx--; exprParsingStack.pop();
                }
                currentExpression.leftOperand = currentExpression.clone();
                currentExpression.operator = arithExpr[i];
                currentExpression.rightOperand = '';
            } else currentExpression.operator = arithExpr[i];
            break;
        case '(':
            if (preNonSpaceChar && (!isNaN(preNonSpaceChar) || preNonSpaceChar === ')'))syntaxError = true;
            else exprParsingStack[++currentExprIdx] = new btreeExpression();
            break;
        case ')':
            currentExprIdx--;
            if (currentExprIdx < 0 || (preNonSpaceChar && isNaN(preNonSpaceChar) && preNonSpaceChar !== ')')) {
                syntaxError = true;
                break;
            }
            exprParsingStack[currentExprIdx].leftOperand ?
                exprParsingStack[currentExprIdx].rightOperand = currentExpression :
                exprParsingStack[currentExprIdx] = currentExpression;
            exprParsingStack.pop();
            break;
        case ' ':
            break;
        default :
            if (isNaN(arithExpr[i]) && arithExpr[i] !== '.')syntaxError = true; //char is not a number
            currentExpression.operator ?
                currentExpression.rightOperand+=arithExpr[i] :
                currentExpression.leftOperand+=arithExpr[i];
        }
        if (syntaxError)break;
    }
    if (syntaxError) {
        result.isSyntaxError = true;
        result.position = i;
    } else {
        currentExpression = exprParsingStack[exprParsingStack.length - 1];
        //console.log(currentExpression); //Print the binary tree expression
        result.value = calculate(currentExpression);
    }
    //console.log(result);
    return result;

    function btreeExpression() { //Data structure for binary tree expression
        this.leftOperand = '';
        this.operator = '';
        this.rightOperand = '';
        this.clone = function () {
            var clonedExpression = new btreeExpression();
            clonedExpression.leftOperand = this.leftOperand;
            clonedExpression.operator = this.operator;
            clonedExpression.rightOperand = this.rightOperand;
            return clonedExpression;
        }
    }

    function calculate(btreeExpr) {
        var _result = 0;
        var _leftOperand = isNaN(btreeExpr.leftOperand) ? calculate(btreeExpr.leftOperand) : btreeExpr.leftOperand;
        var _rightOperand = isNaN(btreeExpr.rightOperand) ? calculate(btreeExpr.rightOperand) : btreeExpr.rightOperand;
        switch (btreeExpr.operator) {
        case '+':
            _result = Number(_leftOperand) + Number(_rightOperand);
            break;
        case '-':
            _result = Number(_leftOperand) - Number(_rightOperand);
            break;
        case '*':
            _result = Number(_leftOperand) * Number(_rightOperand);
            break;
        case '/':
            _result = Number(_leftOperand) / Number(_rightOperand);
            break;
        default :
            _result = Number(_leftOperand);
        }
        return _result;
    }
}
