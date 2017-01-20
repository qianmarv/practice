let [http, fs] = [require('http'), require('fs')];

function load_album_list(fCallback){
    let root = "albums";
    fs.readdir(
        root,
        (err, files)=>{
            if(err){
                fCallback(err);
                return;
            };
            /*
             * Loop won't work
             *
             */
            // aFolders = [];
            // for(let i; i<files.length; i++){
            //     file = files[i];
            //     fs.stat(file, (err, stats)=>{
            //         if(err){
            //             fCallback(err);
            //         }
            //         if(stats.isDirectory()){
            //             console.log(file+" is directory."); // no output
            //             aFolders.push(file);
            //         }
            //     });
            // }
            // fCallback(err, aFolders);
            aFolders = [];
            (function iterator(i){
                if(i === files.length){
                    fCallback(err, aFolders);
                } else {
                    let file = files[i];
                    fs.stat(root+"/"+file, (err,stats)=>{
                        if(err){
                            fCallback(err);
                            return;
                        };
                        if(stats.isDirectory()){
                            aFolders.push(file);
                        };
                        iterator(i+1);
                    });
                };
            })(0);
        }
    );
};

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
