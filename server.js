let express = require('express');

let cors = require('cors');


let app = express();

app.use(cors());

require('dotenv').config();
const PORT = process.env.PORT;


// Location Get Method 
app.get('/location', handelLocation);

function handelLocation(req, res) {


  let city = req.query.city;
  let josnData = require('./data/location.json');
  let josnObject = josnData[0];
  let locationObject = new Location(city, josnObject.display_name, josnObject.lat, josnObject.lon);
  res.status(200).json(locationObject);

}


// weather Get Method 
app.get('/weather', handelWeather);

function handelWeather(req, res) {

  let arrayOfDays=[];

  //   let weather = req.query.weather;
  let josnData = require('./data/weather.json');

  let josnObject = josnData.data;

  josnObject.forEach((value)=>{

    let weatherDay = new WeatherDay(value.weather.description ,value.datetime );
    arrayOfDays.push(weatherDay);
  });
  res.send(arrayOfDays);

}

function WeatherDay(forecast, time) {
  this.forecast = forecast;
  this.time = new Date(time).toDateString();

}


// Location Constructor Funcation  
function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;

}


app.listen(PORT, () => {
  console.log(`The Port is ${PORT}`);

});






