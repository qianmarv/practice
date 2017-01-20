var http=require("http");

function process_request(req, res){
    var body = "Hello World!";
    var content_length = body.length;
    res.writeHead(200, {
        'Content-Length': content_length,
        'Content-Type'  : 'text/plain'
    });
    res.end(body);
}

http.createServer(process_request).listen(4000);
