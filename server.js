// import  Node Modules Libaray
let express = require('express');
let cors = require('cors');
let superagent = require('superagent');
require('dotenv').config();
let pg = require('pg');


//Get the PORT Value From Env File
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const YELP_API_KEY = process.env.YELP_API_KEY;
const Client_ID_Yelp = process.env.Client_ID_Yelp;



// Declare App
let app = express();
const client = new pg.Client(DATABASE_URL);
app.use(cors());



let currentcity = 'amman';
let currentcitylat = '';
let currentcitylon = '';



// Location Get Method
// include The Path and the handelFunction which is Location
app.get('/location', checklocation);
app.get('/weather', handelWeather);
app.get('/trails', handelTrails);
app.get('/movies', handelMovies);
app.get('/yelp', handelYelp);



function checklocation(req, res) {
  console.log('checklocation');
  let city = req.query.city;
  currentcity = city;
  let statment = `SELECT search_query,formatted_query,latitude,longitude FROM locations WHERE search_query='${city}';`;
  client.query(statment).then(data => {
    if (data.rowCount !== 0) {
      currentcitylat = data.rows[0].latitude;
      currentcitylon = data.rows[0].longitude;

      res.send(data.rows[0]);
    }

    else {
      console.log('handelLocation from checkerlocation');
      handelLocation(city, req, res);
    }


  }).catch((error) => {
    console.log('catch Data');
    res.send('error');

  });


}


function handelLocation(city, req, res) {
  //Get the City from URL Pramameter using query
  const KEY = process.env.KEY;
  console.log('handelLocation');
  // use the superagent for API Request (The URL Requested).then(arrow funcation (callback) which recive the data back from api)
  superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${KEY}&q=${city}&format=json`)
    .then(data => {
      console.log('superagent');
      //Store the data that back from API server  // Body where the reviced data stored
      let josnObject = data.body[0];
      let locationObject = new Location(city, josnObject.display_name, josnObject.lat, josnObject.lon);
      currentcitylat = josnObject.lat;
      currentcitylon = josnObject.lon;

      let inserStetment = `INSERT INTO locations (search_query , formatted_query , latitude , longitude) VALUES ($1,$2,$3,$4) RETURNING *;`;
      let values = [city, josnObject.display_name, josnObject.lat, josnObject.lon];
      console.log('inserStetment');
      client.query(inserStetment, values)
        .then(insertedRecord => {
          // For Hanaa res.send(insertedRecord.rows);
          console.log('then');
        }).catch(err => {
          console.log('catch');
          // res.status(500).json({

          //   status: 500,
          //   responseText: 'Sorry, something went wrong',
          // });
        });

      res.status(200).json(locationObject);
    }).catch((error) => {
      res.status(500).json({
        status: 500,
        responseText: 'Sorry, something went wrong',
      });

    });


}
// weather Get Method

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
    }).catch((error) => {
      res.status(500).json({
        status: 500,
        responseText: 'Sorry, something went wrong',
      });
    });

}


function handelTrails(req, res) {

  let TRILSKEY = process.env.TRILSKEY;
  superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${currentcitylat}&lon=${currentcitylon}&maxDistance=1000&key=${TRILSKEY}`)
    .then(data => {
      let josnObject = data.body.trails;

      let arrayOftrail = josnObject.map((tri) => {
        let TrailObject = new Trail(tri);
        return TrailObject;

      });
      res.send(arrayOftrail);
    }).catch((erro) => {
      res.status(500).json({
        status: 500,
        responseText: 'Sorry, something went wrong',
      });
    });

}

function handelMovies(req, res) {

  let cityName = currentcity;
  console.log(cityName);
  let urlmovie = `https://api.themoviedb.org/4/search/movie?api_key=${MOVIE_API_KEY}&query=${cityName}`;
  superagent.get(urlmovie)
    .then(moviedata => {

      let josnObject = moviedata.body.results;
      let arrayOfDays = josnObject.map((movie) => {
        let movieObj = new Movies(movie);

        return movieObj;

      });

      res.send(arrayOfDays);

    }).catch(erro => {

      res.send('hello movies Error', erro);
    });


}

function handelYelp(req, res) {

  let urlYelp = `https://api.yelp.com/v3/businesses/search`;

  const HeaderParameter = {
    terms: 'food',
    location: currentcity,
  };

  superagent.get(urlYelp).query(HeaderParameter)
    .set('Authorization', `Bearer ${YELP_API_KEY}`)
    .then(yelpdata => {

      let josnObject = yelpdata.body.businesses;

      let arrayOfyelp = josnObject.map((yelp) => {

        let yelpObj = new Yelp(yelp);
        return yelpObj;

      });

      res.send(arrayOfyelp);


    }).catch(err => {

      res.status(500).send('Error Page in Yelp Handelling');
    });


}


//  Yelp Constructor Funcatio
function Yelp(yelpObj) {
  this.name = yelpObj.name;
  this.image_url = yelpObj.image_url;
  this.price = yelpObj.price;
  this.rating = yelpObj.rating;
  this.url = yelpObj.url;


}



//  Movies Constructor Funcatio
function Movies(movie) {
  this.title = movie.title;
  this.overview = movie.overview;
  this.average_votes = movie.title;
  this.total_votes = movie.vote_count;
  this.image_url = movie.poster_path;
  this.popularity = movie.popularity;
  this.released_on = movie.release_date;

}


// Weather Constructor Funcatio
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
  this.condition_date = trail.conditionDate.slice(0, trail.conditionDate.indexOf(' '));
  this.condition_time = trail.conditionDate.slice(trail.conditionDate.indexOf(' ') + 1);
}



client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening to port ${PORT}`);
  });
});
// .catch(err =>{
//   console.log('Sorry ... and error occured ..', err);
// });
