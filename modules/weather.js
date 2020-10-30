
let superagent = require('superagent');

const weather = {};

// weather Get Method

weather.handelWeather = function (cityName,req, res) {

  console.log(cityName);
  let WKEY = process.env.WKEY;

  superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${WKEY}`)
    .then(data => {
      let josnObject = data.body.data;

      let arrayOfDays = josnObject.map((day) => {
        let weatherDayObject = new WeatherDay(day.weather.description, day.datetime);
        return weatherDayObject;

      });
      res.send(arrayOfDays);
    }).catch((error) => {
      res.status(500).json({
        status: 500,
        responseText: 'Sorry, something went wrong ',
      });
    });

};




// Weather Constructor Funcatio
function WeatherDay(forecast, time) {
  this.forecast = forecast;
  this.time = new Date(time).toDateString();

}


module.exports = weather;
