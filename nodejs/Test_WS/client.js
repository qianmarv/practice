const WebSocket = require('ws');
const wsc = new WebSocket('ws://localhost:8080');

wsc.on('open', ()=>{
    wsc.send('something from client');
});

wsc.on('message', (data)=>{
    console.log(data);
});
