sap.ui.define([
	"fin/cons/jrnlentr/Component",
	"fin/cons/jrnlentr/ext/controller/ListReportExtension.controller"
], function(Component,ListReportExtension) {
	"use strict";

	QUnit.module("ListReportExtensionTest", {
		beforeEach: function() {
			this.aSinons = [];
			this.oController = sap.ui.controller("fin.cons.jrnlentr.ext.controller.ListReportExtension");
			sap.ushell = {
				Container: {
					getService: function() {
						return {
							hrefForExternal: function() {},
							toExternal: function() {},
							toAppHash: function() {},
							getHash: function(){},
							parseParameters: function(){
								return {
									ConsolidationChartOfAccount: ["Y1"],
									ConsolidationLedger: ["Y1"],
									ConsolidationUnitPair: ["S3004-S3000"],
									ConsolidationVersion: ["Y10"],
									ELTUIDSTRCCSTOTALSRR12Q: ["AmtInCnsldtnGrpCrcyInPrevYr"],
									ConsolidationReportingLevel: ["CO"]
								};
							}
						};
					}
				}
			};
			
			this.oController.extensionAPI = {
				getNavigationController: function() {
					return {
						navigateInternal: function() {}
					};
				}
			};
			//oEvent.getSource().getBindingContext().getProperty(
			this.oController.getView = function() {
				return {
					byId: function() {
						return {
							setVisible: function(bVisible) {}
						};
					},
					setBusy: function(bBusy) {},
					addDependent: function(oDependent) {},
					getId: function() {},
					getBindingContext: function() {
						return {
							getObject: function() {
								return {
									BankAccountInternalID: "0000000001"
								};
							}
						};
					}
				};
			};
		},
		afterEach: function() {}
	});

	// QUnit Start //

	QUnit.test("ListReportExtension controller onBeforeRebindTableExtension method", function() {
		QUnit.ok(this.oController.onBeforeRebindTableExtension, "ListReportExtension controller onBeforeRebindTableExtension method exists");
		var ov1 = {
			getSource: function() {
				return {
					getTable: function() {
						return {
							getColumns: function() {
								var Column = {
									createNew: function(id) {
										var oColumn = {};
										oColumn.id = id;
										oColumn.setWidth = function() {};
										oColumn.getId = function() {
											return oColumn.id;
										};
										return oColumn;
									}
								};
								return new Array(
									Column.createNew('_newConsolidationDocumentNumber'),
									Column.createNew('_newConsolidationPostingItem'),
									Column.createNew('ConsolidationDocumentNumber'),
									Column.createNew('ConsolidationPostingItem'),
									Column.createNew('FinancialStatementItemSubItem'),
									Column.createNew('SubItem'),
									Column.createNew('PartnerConsolidationUnit'),
									Column.createNew('ConsolidationUnit'),
									Column.createNew('AmountInTransactionCurrency'),
									Column.createNew('AmountInLocalCurrency'),
									Column.createNew('AmountInGroupCurrency')
								);
							}
						};
					}
				};
			},
			getParameter: function(){
				return {
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
				                    sPath: "ConsolidationUnitPair",
				                    sOperator: "EQ",
				                    oValue1: "S3004 - S3000",
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
				};
			}
		};
		this.oController.onBeforeRebindTableExtension(ov1);
		
	});

	QUnit.test("ListReportExtension controller onPressConsDoc jump to Cons doc method", function() {
		QUnit.ok(this.oController.onPressConsDoc, "ListReportExtension controller onPressConsDoc method exists");
		var ov1 = {
			getSource: function() {
				return {
					getBindingContext: function() {
						return {
							getProperty: function(str) {
								var rstr;
								if (str === 'ConsolidationDocumentNumber') {
									rstr = '111100';
								} else if (str === 'ConsolidationDocumentType') {
									rstr = '01';
								} else if (str === 'PostingLevel') {
									rstr = '';
								} else if (str === 'ConsolidationUnit') {
									rstr = '10';
								} else if (str === 'FiscalYear') {
									rstr = '2017';
								} else {
									rstr = '1000';
								};
								return rstr;
							}
						};
					}
				};
			}
		};
		this.oController.onPressConsDoc(ov1);
	});

	QUnit.test("ListReportExtension controller onPressConsDoc jump to Accounting doc method", function() {
		QUnit.ok(this.oController.onPressConsDoc, "ListReportExtension controller onPressConsDoc method exists");
		var ov1 = {
			getSource: function() {
				return {
					getBindingContext: function() {
						return {
							getProperty: function(str) {
								var rstr;
								if (str === 'ConsolidationDocumentNumber') {
									rstr = '111100';
								} else if (str === 'ConsolidationDocumentType') {
									rstr = '0F';
								} else if (str === 'PostingLevel') {
									rstr = '';
								} else if (str === 'Unit') {
									rstr = '10';
								} else if (str === 'FiscalYear') {
									rstr = '2017';
								} else {
									rstr = '1000';
								};
								return rstr;
							}
						};
					}
				};
			}
		};
		this.oController.onPressConsDoc(ov1);
	});

	QUnit.test("ListReportExtension controller onPressItem Cons doc method", function() {
		QUnit.ok(this.oController.onPressItem, "ListReportExtension controller onPressItem method exists");
		var ov1 = {
			getSource: function() {
				return {
					getBindingContext: function() {
						return {
							getPath: function() {},         
							getProperty: function(str) {
								var rstr;
								if (str === 'ConsolidationDocumentNumber') {
									rstr = '111100';
								} else if (str === 'ConsolidationDocumentType') {
									rstr = '01';
								} else if (str === 'PostingLevel') {
									rstr = '';
								} else if (str === 'ConsolidationUnit') {
									rstr = '10';
								} else if (str === 'FiscalYear') {
									rstr = '2017';
								} else if (str === 'ConsolidationLedger') {
									rstr = '2017';
								} else if (str === 'ConsolidationDimension') {
									rstr = '2017';
								} else if (str === 'ConsolidationPostingItem') {
									rstr = '2017';
								} else {
									rstr = '1000';
								};
								return rstr;
							}
						};
					}
				};
			}
		};
		this.oController.onPressItem(ov1);
	});

	QUnit.test("ListReportExtension controller onPressItem Accounting doc method", function() {
		QUnit.ok(this.oController.onPressItem, "ListReportExtension controller onPressItem method exists");
		var ov1 = {
			getSource: function() {
				return {
					getBindingContext: function() {
						return {
							getProperty: function(str) {
								var rstr;
								if (str === 'ConsolidationDocumentNumber') {
									rstr = '111100';
								} else if (str === 'ConsolidationDocumentType') {
									rstr = '0F';
								} else if (str === 'PostingLevel') {
									rstr = '';
								} else if (str === 'ConsolidationUnit') {
									rstr = '10';
								} else if (str === 'FiscalYear') {
									rstr = '2017';
								} else if (str === 'ConsolidationLedger') {
									rstr = '2017';
								} else if (str === 'ConsolidationDimension') {
									rstr = '2017';
								} else if (str === 'ConsolidationPostingItem') {
									rstr = '2017';
								} else {
									rstr = '1000';
								};
								return rstr;
							}
						};
					}
				};
			}
		};
		this.oController.onPressItem(ov1);
	});
	
	QUnit.test("ListReportExtension controller onInitSmartFilterBarExtension method", function(){
		QUnit.ok(this.oController.onInitSmartFilterBarExtension, "ListReportExtension Controller onInitSmartFilterBarExtension method exists");
		var ov1 = {
			getSource: function(){
				return {
					getControlByKey: function(sKey){
						return new sap.m.MultiInput({
							
						});
					}
				};
			}
		};
		this.oController.onInitSmartFilterBarExtension(ov1);
	});
});
