const http = require('http');
const port = 8080;

debugger;
const server = http.createServer((req, res) => {
	res.end("Hello, world.");
});

server.listen(port, () => {
	console.log("server listenning on: http://localhost:%s", port);
});
