// steal from http://techslides.com/demos/convert-csv-json.html
function csvJSON(csv){
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
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}


function upload(file) {
    if( file.type.match(/text\/csv/) || file.type.match(/vnd\.ms-excel/) ){
        //if(file.type.match(/text\/csv/)){
        oFReader = new FileReader();
        oFReader.onloadend = function() {

            //console.log(csvJSON(this.result));

            var json = csvJSON(this.result);

            var blob = new Blob([json], {type: 'application/json'});
            var url = URL.createObjectURL(blob);
            output.innerHTML = '<a href="'+url+'">JSON file</a>';
        };
        oFReader.readAsText(file);
    } else {
        console.log("This file does not seem to be a CSV.");
    }
}
