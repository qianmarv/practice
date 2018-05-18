function Filter(path, op, ov1, ov2, bml) {
    this.sPath = path;
    this.sOperator = op;
    this.oValue1 = ov1;
    this.oValue2 = ov2;
    this._bMultiFilter = bml;
}
var paramTree = {
    filters: [{
        aFilters: [{
                aFilters: [{
                    sPath: "ConsolidationChartOfAccounts",
                    sOperator: "EQ",
                    oValue1: "Y1",
                    oValue2: undefined
                }],
                _bMultiFilter: true
            },
            {
                aFilters: [{
                    sPath: "ConsolidationVersion",
                    sOperator: "EQ",
                    oValue1: "Y10",
                    oValue2: undefined
                }],
                _bMultiFilter: true
            },
            {
                aFilters: [{
                        sPath: "FiscalYear",
                        sOperator: "EQ",
                        oValue1: "2017",
                        oValue2: undefined
                    },
                    {
                        sPath: "FiscalYear",
                        sOperator: "EQ",
                        oValue1: "2016",
                        oValue2: undefined 
                    }
                ],
                _bMultiFilter: true
            },
            {
                aFilters: [{
                    sPath: "FiscalPeriod",
                    sOperator: "BT",
                    oValue1: "1",
                    oValue2: "12"
                }],
                _bMultiFilter: true
            },
            {
                aFilters: [{
                    sPath: "ConsolidationUnit",
                    sOperator: "EQ",
                    oValue1: "1510",
                    oValue2: undefined
                }],
                _bMultiFilter: true
            },
            {
                aFilters: [{
                    sPath: "FinancialStatementItem",
                    sOperator: "EQ",
                    oValue1: "799000",
                    oValue2: undefined
                }],
                _bMultiFilter: true
            },
            {
                aFilters: [{
                    sPath: "GLRecordType",
                    sOperator: "EQ",
                    oValue1: "0",
                    oValue2: undefined
                }],
                _bMultiFilter: true
            },
            {
                aFilters: [{
                    sPath: "ConsolidationLedger",
                    sOperator: "EQ",
                    oValue1: "Y1",
                    oValue2: undefined
                }],
                _bMultiFilter: true
            },
            {
                aFilters: [{
                    sPath: "ConsolidationDimension",
                    sOperator: "EQ",
                    oValue1: "Y1",
                    oValue2: undefined
                }],
                _bMultiFilter: true
            }
        ],
        _bMultiFilter: true
    }]
}

function* traverseTreeLeaf(filters) {
    for (var i = 0; i < filters.length; i++) {
        if (!filters[i]._bMultiFilter){
            yield {aFilters: filters, index:i}
        }else {
            yield* traverseTreeLeaf(filters[i].aFilters)
        }
    }
}

function filterTraverser(aFnCallbacks){
    var filterGenerator = traverseTreeLeaf(paramTree.filters);
    while(true){
        var iterObj = filterGenerator.next();
        if(iterObj.done){
            break;
        }
        for(var i=0; i<aFnCallbacks.length; i++){
            aFnCallbacks[i].call(null,iterObj.value.aFilters, iterObj.value.index)
        }
    }
}

var fnChangeVersion = function(aFilter, index){
    if(aFilter[index].sPath === "ConsolidationVersion"){
        aFilter[index].oValue1 = "Y90"
    }
}

var fnDeletePriorYear = function(aFilters, index){
    if(aFilters[index].sPath === "FiscalYear"){
        var aYears = [];
        for(var i=0; i<aFilters.length; i++){
            aYears.push(aFilters[i].oValue1);
        }
        aYears.sort();
        if(aYears[0] === aFilters[index].oValue1){
            aFilters.splice(index,1)
        }
    }
}


var _traverseFilters = function(aFilters, aFnCallbacks){
    (function _traverseTreeLeaf(_filters, _aFnCallbacks) {
        for (var i = 0; i < _filters.length; i++) {
            if (!_filters[i]._bMultiFilter){
                for(var j  = 0; j < _aFnCallbacks.length; j++){
                    _aFnCallbacks[j].call(null,_filters,i);
                }
            }else {
                _traverseTreeLeaf(_filters[i].aFilters,_aFnCallbacks);
            }
        }
    })(aFilters, aFnCallbacks);
}

var run = function(){
    var filterGenerator = traverseTreeLeaf(paramTree.filters);
    while(true){
        var iterObj = filterGenerator.next();
        if(iterObj.done){
            break;
        }
        console.log(iterObj.value)
    }
}
