// import  Node Modules Libaray
let express = require('express');
let cors = require('cors');
let superagent = require('superagent');
require('dotenv').config();

// Declare App
let app = express();
app.use(cors());

//our moduels
const client = require('./modules/client.js');
const location = require('./modules/location.js');
const weather = require('./modules/weather.js');
const trails = require('./modules/trails.js');
const movie = require('./modules/movie.js');
const yelp = require('./modules/yelp.js');



//Get the PORT Value From Env File
const PORT = process.env.PORT;

// Location Get Method
// include The Path and the handelFunction which is Location
app.get('/location', checklocation);
app.get('/weather', handelWeather);
app.get('/trails', handelTrails);
app.get('/movies', handelMovies);
app.get('/yelp', handelYelp);



let currentcity = 'amman';
let currentcitylat = '';
let currentcitylon = '';



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
      location.handelLocation(city, req, res).then( locationdata =>{

        currentcitylat=locationdata.latitude;
        currentcitylon=locationdata.longitude;
        res.send(locationdata);
      }).catch(error =>{

        res.status(500).send('checkLocation catch',error);
      });


    }


  }).catch((error) => {
    console.log('catch Data');
    res.send('error');

  });

}

function handelWeather(res,req){
  weather.handelWeather(currentcity,res,req);

}


function handelTrails(req, res) {

  trails.handelTrails(currentcitylat,currentcitylon,res);
}

function handelMovies(req, res) {

  movie.handelMovies(currentcity,req,res);
}

function handelYelp(req, res) {

  yelp.handelYelp(currentcity,req,res);

}


client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening to port ${PORT}`);
  });
}).catch(err =>{
  console.log('Sorry ... and error occured ..', err);
});
