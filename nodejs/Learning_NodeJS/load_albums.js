let [http, fs] = [require('http'), require('fs')];

function load_album_list(fCallback){
    fs.readdir(
        "albums",
        (err, files)=>{
            if(err){
                fCallback(err);
                return;
            }
            fCallback(null, files);
        }
    );
}

function handle_request(req, res){
    console.log("Incoming request: " + req.method + " " + req.url);
    load_album_list((err, albums)=>{
        if(err){
            res.writeHead(503,{
                "Content-Type" : "application/json"
            });
            res.end(JSON.stringify(err)+"\n");
            return;
        }
        let out = {
            error: null,
            data: {alnums: albums}
        };
        res.writeHead(200, {"Content-Type": "application/json"} );
        res.end(JSON.stringify(out)+"\n");
    });
}

http.createServer(handle_request).listen(4000);
