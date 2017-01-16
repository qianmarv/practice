<DOCTYPE HTML>
<body>
	<script>
		function peel_Orange(expression)
		{
			var _inputArray=[];
			var _tempChar="";
			var _exp="";
			for (var i = 0; i < expression.length; i++) {
				_tempChar = expression.charAt(i);
				if (_tempChar !== ")") {
					_inputArray.push(_tempChar);
				}
				else{
					_exp = "";
					_tempChar = _inputArray.pop();
					while(_tempChar !== "(")
					{
						_exp = _tempChar + _exp;
						_tempChar = _inputArray.pop();
					}
					_inputArray.push(calc(_exp));
				};
			};
			return  calc(_inputArray.join(""));
		}
		
		function calc(expression, reg)
		{
			var _result = 0;
			var _reg;
			reg === undefined ? _reg = /[+]|[-]/ : _reg = reg;
			var _operandArray = expression.split(_reg);
			var _index = _operandArray[0].length;
			for (var i = 0; i < _operandArray.length; i++) {
				switch(expression.charAt(_index))
				{
					case "+": _operandArray[0] = (parseFloat(calc(_operandArray[0],/[*\/]/))+parseFloat(calc(_operandArray[i+1],/[*\/]/))).toString();
							  _index+=_operandArray[i+1].length+1;
							  break;
					case "-": _operandArray[0] = (calc(_operandArray[0],/[*\/]/)-calc(_operandArray[i+1],/[*\/]/)).toString();
							  _index+=_operandArray[i+1].length+1;
							  break;
					case "*": _operandArray[0] = (_operandArray[0]*_operandArray[i+1]).toString();
							  _index+=_operandArray[i+1].length+1;
							  break;
					case "/": _operandArray[0] = (_operandArray[0]/_operandArray[i+1]).toString();
							  _index+=_operandArray[i+1].length+1;
							  break;
					default: (_operandArray[0].indexOf("*") === -1 && _operandArray[0].indexOf("/") === -1) ? _result = _operandArray[0] : _result = calc(_operandArray[0],/[*\/]/);
				}
			};
			return _result;
		}

		console.log("Steve: \n");
		console.log("1+2 = " + peel_Orange("1+2"));
		console.log("1+2*2 = " + peel_Orange("1+2*2"));
		console.log("1+2*2-4 = " + peel_Orange("1+2*2-4"));
		console.log("1+2*2-4/2 = " + peel_Orange("1+2*2-4/2"));
		console.log("1+2*2-4/3 = " + peel_Orange("1+2*2-4/3"));
		console.log("1+2*3*6/2-7+10*5+6 = " + peel_Orange("1+2*3*6/2-7+10*5+6"));
		console.log("(1+2)*2-4/3 = " + peel_Orange("(1+2)*2-4/3"));
		console.log("(1+2)*2-4/(3-1) = " + peel_Orange("(1+2)*2-4/(3-1)"));
		console.log("(1+(2/3)-(4*(3+4)))+100 = " + peel_Orange("(1+(2/3)-(4*(3+4)))+100"));

		console.log("\n");
		console.log("Vincent: \n");
        console.log('(1+2)*3 = ' + peel_Orange('(1+2)*3'));
        console.log('(1+2)*30 = ' + peel_Orange('(1+2)*30'));
        console.log('(1+2)*(3+4) = ' + peel_Orange('(1+2)*(3+4)'));
        console.log('(1+2)*(3+4)/7 = ' + peel_Orange('(1+2)*(3+4)/7'));
        console.log('      1+2*3+4 = ' + peel_Orange('      1+2*3+4'));
        console.log('(1+2*3+4/2)/3 = ' + peel_Orange('(1+2*3+4/2)/3'));
        console.log('((1+2*3+4/2)/3+2)*4 = ' + peel_Orange('((1+2*3+4/2)/3+2)*4'));
        console.log('5*(1+2*3+2) = ' + peel_Orange('5*(1+2*3+2)'));
        console.log('5+((1+2)*4)-3 = ' + peel_Orange('5+((1+2)*4)-3'));
        console.log('5+  ((1.5+  1.5)   * 4 )-3 = ' + peel_Orange('5+  ((1.5+  1.5)   * 4 )-3'));
        console.log('5+ 6 + 2*3*6/4 - 8 + 1 = ' + peel_Orange('5+ 6 + 2*3*6/4 - 8 + 1'));

	</script>
</body>
