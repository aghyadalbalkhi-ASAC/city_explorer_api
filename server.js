let express = require('express');             // import  express Libaray 
let cors = require('cors');                 // import  express Libaray 
let superagent = require('superagent');       // import  express Libaray 
let app = express();            // Declare App 

app.use(cors());
require('dotenv').config();
const PORT = process.env.PORT;            //Get the PORT Value From Env File 

let currentcity='amman';

// Location Get Method 
app.get('/location', handelLocation);             // include The Path and the handelFunction which is Location

function handelLocation(req, res) {

  let city = req.query.city;        //    get the City from URL Pramameter using query 
  currentcity=city;
  const KEY =process.env.KEY;         //Get the KEY Value From Env File 

  // use the superagent for API Request (The URL Requested).then(arrow funcation (callback) which recive the data back from api)
  superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${KEY}&q=${city}&format=json`)
    .then(data =>{
      let josnObject = data.body[0];        //Store the data that back from API server  // Body where the reviced data stored
      let locationObject = new Location(city, josnObject.display_name, josnObject.lat, josnObject.lon);

      res.status(200).json(locationObject);
    }).catch(()=>{
      res.status(500).json({
        status: 500,
        responseText: "Sorry, something went wrong",
      });

    } );

  // let josnData = require('./data/location.json');


}

//https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=71b466b89b734b6d8c5566794767010f
// weather Get Method 
app.get('/weather', handelWeather);

function handelWeather(req, res) {

  let cityName = currentcity;
  let WKEY = process.env.WKEY;

  superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${WKEY}`)
    .then(data =>{
      let josnObject = data.body.data;

      let arrayOfDays = josnObject.map( (day) => {
        let weatherDayObject = new WeatherDay(day.weather.description ,day.datetime );
        return weatherDayObject;

      });
      res.send(arrayOfDays);
    }).catch(()=>{
      res.status(500).json({
        status: 500,
        responseText: "Sorry, something went wrong",
      });
    } );

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






