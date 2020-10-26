let express = require('express');             // import  express Libaray 
let cors = require('cors');                 // import  express Libaray 
let superagent = require('superagent');       // import  express Libaray 
let app = express();            // Declare App 

app.use(cors());
require('dotenv').config();
const PORT = process.env.PORT;            //Get the PORT Value From Env File 



// Location Get Method 
app.get('/location', handelLocation);             // include The Path and the handelFunction which is Location

function handelLocation(req, res) {

  let city = req.query.city;        //    get the City from URL Pramameter using query 
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


// weather Get Method 
app.get('/weather', handelWeather);

function handelWeather(req, res) {

  try{

    //   let weather = req.query.weather;
    let josnData = require('./data/weather.json');

    let josnObject = josnData.data;

    let arrayOfDays = josnObject.map( (day) => {
      return new WeatherDay(day.weather.description ,day.datetime );
    });

    res.send(arrayOfDays);
  }catch(error){

    return res.status(500).json({
      status: 500,
      responseText: "Sorry, something went wrong",
    });
  }


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






