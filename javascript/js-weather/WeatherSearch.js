import request from "request";

class WeatherSearch {
    constructor() {
        this.cityName = "";
    }

    async search(cityName, cb) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.cityName = cityName;
            console.log("将要查询的城市是：" + cityName);
            request('https://www.sojson.com/open/api/weather/json.shtml?city=' + encodeURI(cityName), function (error, response, body) {
                console.log('error: ', error);
                console.log('statusCode: ', response && response.statusCode);
                console.log('body: ', body);
                var data = JSON.parse(body).data;
                var forecast = data.forecast;
                for (var i = 0; i < forecast.length; i++) {
                    var oneWeather = forecast[i];
                    var date = oneWeather.date;
                    var low = oneWeather.low;
                    var high = oneWeather.high;

                    var finalData = [];

                    finalData.push({ "date": date, "low": low, "high": high });
                }
                WeatherSearch.callNum += 1;
                if(WeatherSearch.notifyNumEvent && typeof WeatherSearch.notifyNumEvent == "function"){
                    WeatherSearch.notifyNumEvent(WeatherSearch.callNum);
                };
                resolve(finalData);
                //reject("发生错误了");
            });
        })
    }
}

WeatherSearch.callNum = 0;
WeatherSearch.notifyNumEvent = null;

export default WeatherSearch;
//export default WeatherSearch;