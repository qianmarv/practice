sap.ui.controller("fin.cons.jrnlentr.ext.controller.ListReportExtension", {

	onInitSmartFilterBarExtension: function(oEvent){
		var sService = sap.ushell.Container.getService("URLParsing");
		var oURLParam = sService.parseParameters(decodeURIComponent(sService.getHash(location)));
		var oFilterBar = oEvent.getSource();
		
		this._breakoutOnPostingLevel(oFilterBar, oURLParam);		
		this._breakoutOnConsolidationUnitPair(oFilterBar, oURLParam);	
		this._breakoutOnYearComparision(oFilterBar, oURLParam);	
	},
    
	onPressConsDoc: function(oEvent) {
		var oDocnr = oEvent.getSource().getBindingContext().getProperty("ConsolidationDocumentNumber"); // read SupplierID from OData path Product/SupplierID

		var oDocType = oEvent.getSource().getBindingContext().getProperty("ConsolidationDocumentType");
		var oPostLv = oEvent.getSource().getBindingContext().getProperty("PostingLevel");
		var oConsUnit = oEvent.getSource().getBindingContext().getProperty("ConsolidationUnit");
		// var oCompanyCode = oConsUnit;
		var oCompanyCode = oEvent.getSource().getBindingContext().getProperty("CompanyCode");
		var oCompanyCodeFix = oCompanyCode;
		//var oCompanyCode = oConsUnit;
		while (oCompanyCodeFix.length < 4) {
			oCompanyCodeFix = "0" + oCompanyCodeFix;
		}
		var oFiscalYear = oEvent.getSource().getBindingContext().getProperty("FiscalYear");
		var oRefFiscalYear = oEvent.getSource().getBindingContext().getProperty("ReferenceFiscalYear");
		// if (oRefFiscalYear === "") {
		// 	oRefFiscalYear = oFiscalYear;
		// }
		var oSemanticObject, oAction, oParams;
		if (oPostLv == "" && oDocType == "0F") {
			oSemanticObject = "AccountingDocument";
			oAction = "manage";
			oParams = {
				"AccountingDocument": oDocnr,
				"CompanyCode": oCompanyCodeFix,
				"FiscalYear": oRefFiscalYear
			};
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: oSemanticObject,
					action: oAction
				},
				params: oParams
			})) || ""; // generate the Hash to display a Supplier

			oCrossAppNavigator.toExternal({
				target: {
					shellHash: hash
				}
			}); // navigate to Supplier application
		} else {
			var navCon = this.extensionAPI.getNavigationController();
			navCon.navigateInternal(oEvent.getSource().getBindingContext());
		}
	},

	// _isNullValue: function(obj) {
	// 	return !obj || obj === 'null' || obj === 'undefined';
	// },

	onPressItem: function(oEvent) {
		// var that = this;
		var oDocnr = oEvent.getSource().getBindingContext().getProperty("ConsolidationDocumentNumber"); // read SupplierID from OData path Product/SupplierID
		var oLead0Docnr = oDocnr;
		while (this._alphaConvRequired(oLead0Docnr, 10)) {
			oLead0Docnr = "0" + oLead0Docnr;
		}
		var oItem = oEvent.getSource().getBindingContext().getProperty("ConsolidationPostingItem");
		var oDocType = oEvent.getSource().getBindingContext().getProperty("ConsolidationDocumentType");
		var oPostLv = oEvent.getSource().getBindingContext().getProperty("PostingLevel");
		var oConsUnit = oEvent.getSource().getBindingContext().getProperty("ConsolidationUnit");
		var oCompanyCode = oEvent.getSource().getBindingContext().getProperty("CompanyCode");
		var oCompanyCodeFix = oCompanyCode;
		//var oCompanyCode = oConsUnit;
		while (oCompanyCodeFix.length < 4) {
			oCompanyCodeFix = "0" + oCompanyCodeFix;
		}
		var oFiscalYear = oEvent.getSource().getBindingContext().getProperty("FiscalYear");
		var oRefFiscalYear = oEvent.getSource().getBindingContext().getProperty("ReferenceFiscalYear");
		// if (oRefFiscalYear === "") {
		// 	oRefFiscalYear = oFiscalYear;
		// }
		var oLedger = oEvent.getSource().getBindingContext().getProperty("ConsolidationLedger");
		var oDimen = oEvent.getSource().getBindingContext().getProperty("ConsolidationDimension");
		//var oFiscalPeriod = oEvent.getSource().getBindingContext().getProperty("FiscalPeriod");
		var oSemanticObject, oAction, oParams;
		// if ( that._isNullValue(oPostLv) || that._isNullValue(oDocType) ) {
		// 	alert("Column Posting Level and Document Type is required for Navigation");
		// }
		if (oPostLv == "" && oDocType == "0F") {
			oSemanticObject = "AccountingDocument";
			oAction = "manage";
			oParams = {
				"AccountingDocument": oDocnr,
				"AccountingDocumentItem": oItem,
				"CompanyCode": oCompanyCodeFix,
				"FiscalYear": oRefFiscalYear
			};
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: oSemanticObject,
					action: oAction
				},
				params: oParams
			})) || ""; // generate the Hash to display a Supplier

			oCrossAppNavigator.toExternal({
				target: {
					shellHash: hash
				}
			}); // navigate to Supplier application
		} else {
			var shellNav = sap.ushell.Container.getService("ShellNavigation");
			var sDocLink = oEvent.getSource().getBindingContext();
			var hashInt = sDocLink.getPath() +
				"/to_Item(" + "ConsolidationLedger='" + oLedger + "',ConsolidationDimension='" + oDimen + "',FiscalYear='" + oFiscalYear +
				"',ReferenceFiscalYear='" + oRefFiscalYear + "',CompanyCode='" + oCompanyCode + "',ConsolidationDocumentNumber='" + oDocnr +
				"',ConsolidationPostingItem='" + oItem + "',ConsolidationRecordNumber='" + oLead0Docnr + oItem + "')";
			// var hashInt = "/C_CnsldtnJrnlEntr('.1~" + oLedger + ".3~" + oDimen + ".4~" + oFiscalYear + ".5~" + oRefFiscalYear + ".6~" + oCompanyCode + ".8~" + oLead0Docnr + ".9~" + oItem +
			// 	"')/to_Item(" + "ConsolidationLedger='" + oLedger + "',ConsolidationDimension='" + oDimen + "',FiscalYear='" + oFiscalYear + "',ReferenceFiscalYear='" + oRefFiscalYear + 
			// 	"',CompanyCode='" + oCompanyCode +
			// 	"',ConsolidationDocumentNumber='" + oDocnr + "',ConsolidationPostingItem='" + oItem + "',ConsolidationRecordNumber='" + oLead0Docnr + oItem + "')";
			shellNav.toAppHash(hashInt);
		}
	},

	onBeforeRebindTableExtension: function(oEvent) { //P3
		var oSource = oEvent.getSource();
		var oTable = oSource.getTable();

		if (oTable) {
			var aColumns = oTable.getColumns();
			var iColumns = aColumns.length;
			var oNewDocNumCol, oNewPostItemCol, oDocNumCol, oPostItemCol;
			for (var i = 0; i < iColumns; i++) {
				var sColumnId = aColumns[i].getId();
				var sFieldName = sColumnId.substr(sColumnId.lastIndexOf("-") + 1);
				if (sFieldName === "_newConsolidationDocumentNumber") {
					oNewDocNumCol = aColumns[i];
				} else if (sFieldName === "_newConsolidationPostingItem") {
					oNewPostItemCol = aColumns[i];
				} else if (sFieldName === "ConsolidationDocumentNumber") {
					oDocNumCol = aColumns[i];
				} else if (sFieldName === "ConsolidationPostingItem") {
					oPostItemCol = aColumns[i];
				} else if (sFieldName === "FinancialStatementItem") {
					aColumns[i].setWidth("90px");
				} else if (sFieldName === "SubItem") {
					aColumns[i].setWidth("90px");
				} else if (sFieldName === "PartnerConsolidationUnit") {
					aColumns[i].setWidth("90px");
				} else if (sFieldName === "CnsldtnUnit") {
					aColumns[i].setWidth("90px");
				} else if (sFieldName === "AmountInTransactionCurrency") {
					aColumns[i].setWidth("120px");
				} else if (sFieldName === "AmountInLocalCurrency") {
					aColumns[i].setWidth("120px");
				} else if (sFieldName === "AmountInGroupCurrency") {
					aColumns[i].setWidth("120px");
				}
			}
			oDocNumCol.setWidth("0px");
			oPostItemCol.setWidth("0px");
		}
	},

	_alphaConvRequired: function(string, length) {
		if (string.length >= length) {
			return false;
		} else {
			return /^\d+$/.test(string);
		}
	},

	_createToken : function(v){
		return new sap.m.Token({
						key: v,
						text: "=" + v
					});	
	},
	
	_breakoutOnPostingLevel: function(oFilterBar, oURLParams) {
		if( !oURLParams.PostingLevel
		  && oURLParams.ConsolidationReportingLevel){
			var oPostingLevelCtrl = oFilterBar.getControlByKey("PostingLevel");
		 	var sReportingLevel   = oURLParams.ConsolidationReportingLevel[0];
			var aTokens;
			switch (sReportingLevel) {
				case "CO":
					aTokens = [ this._createToken(""),
								this._createToken("00"),
								this._createToken("01"),
								this._createToken("0C"),
								this._createToken("0T"),
								this._createToken("10") ];
					break;
				case "GR":
					aTokens = [ this._createToken("02"),
								this._createToken("22"),
								this._createToken("30") ];
					break;
				case "PA":
					aTokens = [ this._createToken("20") ];
					break;
				default:
			}
			if (typeof aTokens !== "undefined"){
				oPostingLevelCtrl.setTokens( aTokens );
			}
		}
	},

	_breakoutOnYearComparision: function(oFilterBar, oURLParams) {
		// Year Comparision Relevant Query
		var aRelevantStruc = [
			"CCCMPLXRPT01Q",
			"CCCMPLXRPT02Q",
			"CCCMPLXRPT03Q",
			"CCSMPLXRPT01Q",
			"CCSTOTALSRR12Q",
			"CCSTOTALSRR22Q",
			"CCSTOTALSRR32Q",
			"CCSTOTALSRR32Q",
			"CCSTOTALS22Q",
			"CCSTOTALS32Q"
		].map( function(item) {
				return  "ELTUIDSTR" + item;
			});

		var aAmountInCurrentYear = [
			"YTDAmtInCnsldtnGroupCrcy",
			"YTDAmtInCnsldtnLocalCrcy",
			"AmountInGroupCurrency",
			"AmountInLocalCurrency"
		];
		var aAmountInPreviousYear = [
			"YTDAmtInGrpCrcyInPrevYr",
			"YTDAmtInLoclCrcyInPrevYr",
			"AmtInCnsldtnGrpCrcyInPrevYr",
			"AmtInCnsldtnLocalCrcyInPrevYr"
		];
				
		if(!oURLParams.FiscalYear){
			var oFiscalYearCtrl = oFilterBar.getControlByKey("FiscalYear");
			var that = this;
			that.oYearCompare = {
				bRelevant : false,
				bHandled  : false,
				bIsCurrentYear: false
			};
			for (var i = 0; i < aRelevantStruc.length; i++) {
				var measure = oURLParams[aRelevantStruc[i]] && oURLParams[aRelevantStruc[i]][0];
				if (measure) {
					if (aAmountInCurrentYear.indexOf(measure)) {
						that.oYearCompare.bIsCurrentYear = true;
						that.oYearCompare.bRelevant = true;
						break;
					} else if (aAmountInPreviousYear.indexOf(measure)) {
						that.oYearCompare.bIsCurrentYear = false;
						that.oYearCompare.bRelevant = true;
						break;
					}
				}
			}
			
			if(that.oYearCompare.bRelevant){
				var fnHandler = function(oChangeEvent){
					if(!that.oYearCompare.bHandled){
						var _Ctrl = oChangeEvent.getSource();
						var aTokens = _Ctrl.getTokens();
						if(aTokens.length === 2){
							var aFiscalYear =  aTokens.map( 
								function(token){
									if(token instanceof sap.m.Token){
										var oCustomData = token.getCustomData() && token.getCustomData()[0];
										if(oCustomData instanceof sap.ui.core.CustomData){
											var v = oCustomData.getValue();
											if( v.exclude   === false
											 && v.operation === "EQ"
											 && v.keyField  === "FiscalYear"){
												return v.value1;
											}
										}
									}
								}).sort();
							_Ctrl.detachTokenChange(fnHandler);
							_Ctrl.removeAllTokens();
							if (that.oYearCompare.bIsCurrentYear) {
								_Ctrl.setTokens([that._createToken(aFiscalYear[1])]);
							} else {
								_Ctrl.setTokens([that._createToken(aFiscalYear[0])]);
							}
							that.oYearCompare.bHandled = true;
						}
					}
				};
				oFiscalYearCtrl.attachTokenChange(fnHandler);
				oFiscalYearCtrl.attachTokenUpdate(fnHandler);
			}
		}
	},

	_breakoutOnConsolidationUnitPair: function(oFilterBar, oURLParams) {
		//Reorder consolidation unit pair based on alphabet 
		var oConsolidationUnitCtrl = oFilterBar.getControlByKey("ConsolidationUnit");
		var oPartnerUnitCtrl = oFilterBar.getControlByKey("PartnerConsolidationUnit");
		
		var sPairValue = oURLParams.ConsolidationUnitPair && oURLParams.ConsolidationUnitPair[0];
		var that = this;
		if(sPairValue){
			if(!oURLParams.ConsolidationUnit){
				oConsolidationUnitCtrl.setTokens(sPairValue.split("-").map(function(cu) {
											return that._createToken(cu.trim());
										}));
			}			
			if(!oURLParams.PartnerConsolidationUnit){
				oPartnerUnitCtrl.setTokens(sPairValue.split("-").map(function(cu) {
											return that._createToken(cu.trim());
									}));
			}
		}
	}
});
