var iframe = document.createElement('iframe');
var html = '<body id="qianmarv">Foo</body>';
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
document.body.appendChild(iframe);
console.log('iframe.contentWindow =', iframe.contentWindow);

sap.ui.getCore().attachInit(function () {

    console.log("UI5 Loaded!");
    new sap.m.Bar("qianmarv-auto-gfn",{
        contentLeft: [
            new sap.m.Button({
            text: "Click Me",
            press: onPress,
        })],
        contentMiddle: [
            new sap.m.Label({
                text: "This is first step"
            })
        ]

    }).placeAt('qianmarv','first');
    function onPress(){
        console.log("Say Hello!");
    }
});
