// ==UserScript==
// @name         Semi-Auto Fill Global Field Names
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       qianmarv
// @match        *://gtnc-w0211397f.dispatcher.int.sap.hana.ondemand.com/webapp/index.html*
// @grant        none
// ==/UserScript==
// @require https://code.jquery.com/jquery-1.12.4.min.js
(function() {
    'use strict';

    // Your code here...
    // Global Variables
    var oGFN;
    var aStates = [1,  // Initial
                   2,  // GFN Uploaded
                   3,  // Enter Global Filed name (modal Message Box) Don't know whether could be manipulate
                   4,  // Add GFN Page
                  ];
    var currentState = 1;
    var currentIndex = 0;
    var currentPage;
    var aNextBtn = [];

    // Functions...........
    function upload2json(oFile){
        var file = oFile.getParameter('files')[0];
        if( file.type.match(/text\/csv/) || file.type.match(/vnd\.ms-excel/) ){
            var oFReader = new FileReader();
            oFReader.onloadend = function() {
                var csv = this.result;
                var lines=csv.split("\n");
                var result = [];
                var headers=lines[0].split(",");
                for(var i=1;i<lines.length;i++){
                    var obj = {};
                    var currentline=lines[i].split(",");
                    for(var j=0;j<headers.length;j++){
                        obj[headers[j]] = currentline[j];
                    }
                    result.push(obj);
                }
                // Create Next Button.
                oGFN = result;
                currentState = 2;
                console.log("json file uploaded");
                attachButton();
            };
            oFReader.readAsText(file);
        } else {
            sap.m.MessageToast.show("This file does not seem to be a CSV.");
        }
    }
    function getContent(gfn){
        for(let i=0; i<oGFN.length; i++){
            if(oGFN[i].GFN == gfn){
                return oGFN[i];
            }
        }
    }
    function fNext(){
        if(typeof oGFN === 'undefined'){
            sap.m.MessageToast.show('Please upload your GFN list first');
        }else{
            console.log("currentState="+currentState);
            if(location.href.indexOf("GlobalFieldsRoute") > -1){
                currentState = 2;
            } else if(location.href.indexOf("GlobalFieldRoute") > -1){
                currentState = 4;
            }
            switch(currentState){
                case 2:
                    sap.ui.getCore().byId("__button8").firePress();
                    var timerId = setInterval(function(){
                        var oInputGFN = sap.ui.getCore().byId("GlobalFieldNameInput");
                        if(typeof currentPage !== 'undefined'){
                            clearInterval(timerId);
                            oInputGFN.setValue(oGFN[currentIndex]['GFN']).fireLiveChange();
                            //User Choose Created
                            sap.ui.getCore().byId("CreateButton").attachPress(function(){
                                currentState = 4;
                                attachButton();
                            });
                            //User Choose Cancel
                            //sap.ui.getCore().byId("__button13").attachPress(function(){
                            //    currentState = 2;
                            //});
                        }
                    }, 1000);
                    break;
                case 4: // Fill Other Fields
                    let oContainer = sap.ui.getCore().byId("__xmlview2");
                    let gfn = oContainer.byId("GlobalFieldInput").getValue();
                    let gfnContent = getContent(gfn);
                    oContainer.byId("ApproverInput").setValue(gfnContent["APPROVER"]);
                    oContainer.byId("StatusSelect").setSelectedKey("locApprovalRequested");
                    oContainer.byId("RepresentationTermSelect").setSelectedKey(gfnContent["TERM"]);
                    oContainer.byId("DescriptionTextArea").setValue(gfnContent["LABEL"]);
                    oContainer.byId("DefaultDataElementInput").setValue(gfnContent["DDELM"]);
                    oContainer.byId("GlobalFieldRespApplicationAreaInput").setValue(gfnContent["AC"]);
                   // oContainer.byId("GlobalFieldRespApplicationAreaInput").fireChange();
                    oContainer.byId("StatusCommentTextArea").setValue("").fireChange();
                    oContainer.byId("SubmitChangesButton").firePress();
                    currentState = 2;
                    currentIndex ++;
                    sap.ui.getCore().byId("__page2-navButton").firePress(); // Back to List Page
                    break;
            }
        }
    }
    function attachButton(){
        var sViewId, sPageId, sBtnId;
        switch(currentState){
            case 1:
                sPageId  = "__page1";
                sViewId  = "__xmlview1";
                break;
            case 2:
                sPageId  = "__page1";
                sViewId  = "__xmlview1";
                break;
            case 4:
                sPageId  = "__page2";
                sViewId  = "__xmlview2";
                break;
            default:
        }
        sBtnId = sPageId+'-af_btn';
        var timerId = setInterval(function() {
            currentPage = sap.ui.getCore().byId(sPageId);
            if(typeof currentPage !== 'undefined'){
                clearInterval(timerId);
                if(currentState === 1){
                    jQuery.sap.require('sap/ui/unified/FileUploader');
                    currentPage.addHeaderContent(new sap.ui.unified.FileUploader({ change: upload2json }));
                } else {
                    var oBtn;
                    for(var i=0; i<aNextBtn.length; i++){
                        if(aNextBtn[i]["id"] == sBtnId ){
                            oBtn = aNextBtn[i]["btn"];
                            break;
                        }
                    };
                    if(oBtn === undefined){
                        var oNewBtn = new sap.m.Button(sBtnId,{ text: 'Next', press: fNext });
                        aNextBtn.push({"id": sBtnId,"btn": oNewBtn});
                        currentPage.addHeaderContent(oNewBtn);
                    }
                }
            }
        }, 1000);
    }
    sap.ui.getCore().attachInit(function(){
        attachButton();
    });
})();
