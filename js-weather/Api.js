//import WetherSearch from "./WetherSearch.js";
var WeatherSearch = require("./WeatherSearch.js").default;

async function run(cityName) {

    var wsInstance = new WeatherSearch();
    var data = await wsInstance.search(cityName);
    if(data){
        return Promise.resolve(data);
    }else{
        return Promise.resolve(null);
    }
}
WeatherSearch.notifyNumEvent = function(callNum){
    console.log("API被调用了" + callNum + "Times");
}
var express = require('express');
var app = express();
app.get('/search/:cityName', async function(req, res){
    var cityName = req.params["cityName"];
    var data = await run(cityName);
    res.send(data);
})
app.listen(3000);

