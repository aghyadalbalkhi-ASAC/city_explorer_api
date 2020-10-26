// import  express Libaray
let express = require('express');

// import  express Libaray
let cors = require('cors');

// import  express Libaray
let superagent = require('superagent');

// Declare App
let app = express();

app.use(cors());
require('dotenv').config();

//Get the PORT Value From Env File
const PORT = process.env.PORT;

let currentcity = 'amman';
let currentcitylat= '';
let currentcitylon= '';

// Location Get Method 
// include The Path and the handelFunction which is Location
app.get('/location', handelLocation);

function handelLocation(req, res) {

  //Get the City from URL Pramameter using query
  let city = req.query.city;
  currentcity = city;
 
  //Get the KEY Value From Env File
  const KEY = process.env.KEY;

  // use the superagent for API Request (The URL Requested).then(arrow funcation (callback) which recive the data back from api)
  superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${KEY}&q=${city}&format=json`)
    .then(data => {

      //Store the data that back from API server  // Body where the reviced data stored
      let josnObject = data.body[0];
      let locationObject = new Location(city, josnObject.display_name, josnObject.lat, josnObject.lon);
      currentcitylat = josnObject.lat;
      currentcitylon = josnObject.lon;
      res.status(200).json(locationObject);
    }).catch(() => {
      res.status(500).json({
        status: 500,
        responseText: "Sorry, something went wrong",
      });

    });

  // let josnData = require('./data/location.json');


}

//https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=71b466b89b734b6d8c5566794767010f
// weather Get Method
app.get('/weather', handelWeather);

function handelWeather(req, res) {

  let cityName = currentcity;
  let WKEY = process.env.WKEY;

  superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${WKEY}`)
    .then(data => {
      let josnObject = data.body.data;

      let arrayOfDays = josnObject.map((day) => {
        let weatherDayObject = new WeatherDay(day.weather.description, day.datetime);
        return weatherDayObject;

      });
      res.send(arrayOfDays);
    }).catch(() => {
      res.status(500).json({
        status: 500,
        responseText: "Sorry, something went wrong",
      });
    });

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


app.get('/trails', handelTrails);

function handelTrails(req, res) {

  let TRILSKEY = process.env.TRILSKEY;
  console.log(currentcitylat,currentcitylon);
  superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${currentcitylat}&lon=${currentcitylon}&maxDistance=1000&key=${TRILSKEY}`)
    .then(data => {
      let josnObject = data.body.trails;

      let arrayOftrail = josnObject.map((tri) => {
        let TrailObject = new Trail(tri);
        return TrailObject;

      });
      res.send(arrayOftrail);
    }).catch(() => {
      res.status(500).json({
        status: 500,
        responseText: "Sorry, something went wrong",
      });
    });

}



// Trails  Constructor Funcation

function Trail(trail) {
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trails_url = trail.url;
  this.conditions = trail.conditionStatus;
  this.condition_date = trail.conditionDate.slice(0,trail.conditionDate.indexOf(' '));
  this.condition_time = trail.conditionDate.slice(trail.conditionDate.indexOf(' ')+1);
}



app.listen(PORT, () => {
  console.log(`The Port is ${PORT}`);

});
