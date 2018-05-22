var createFilterBreakoutHandler = function(_event, _location){
    return (new function FilterBreakoutHandler(){
        var sService    = sap.ushell.Container.getService("URLParsing");

        var params  = sService.parseParameters(decodeURIComponent(sService.getHash(_location)));
        var filters = _event.getParameter("bindingParams").filters;

        this._aNewFilters = [];
        this._aTraversCallbacks = [];

        this.attachTraverse = function(fnFunction){
            if(typeof fnFunction === 'function'){
                this._aTraversCallbacks.push(fnFunction);
            }
        };

        this.addFilter = function(oFilter){
            if(oFilter instanceof sap.ui.model.Filter){
                this._aNewFilters.push(oFilter);
            }
        };

        this._fireAddFilter = function(){
            if(filters.length === 0){
                filters.push(new sap.ui.model.Filter({filters:[], and:true}));
            }
            for(var i=0; i<this._aNewFilters.length; i++){
                filters[0].aFilters.push(this._aNewFilters[i]);
            }
        };

        this._fireTraverse = function(){
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
            })(filters, this._aTraversCallbacks);
        };


        this.fireBreakout = function(){
            this._fireTraverse();
            this._fireAddFilter();
        };

    })(oEvent, location);
};


var oFilterBOH = createFilterBreakoutHandler({}, "Hello");
oFilterBOH.attachTraverse();

oFilterBOH.runBreakout();
