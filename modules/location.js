
let superagent = require('superagent');
let client = require ('./client.js');



const location ={};

location.handelLocation=function(city, req, res) {
  //Get the City from URL Pramameter using query
  const KEY = process.env.KEY;
  console.log('handelLocation');
  // use the superagent for API Request (The URL Requested).then(arrow funcation (callback) which recive the data back from api)
  return superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${KEY}&q=${city}&format=json`)
    .then(data => {
      console.log('superagent');
      //Store the data that back from API server  // Body where the reviced data stored
      let josnObject = data.body[0];
      let locationObject = new Location(city, josnObject.display_name, josnObject.lat, josnObject.lon);
      let inserStetment = `INSERT INTO locations (search_query , formatted_query , latitude , longitude) VALUES ($1,$2,$3,$4) RETURNING *;`;
      let values = [city, josnObject.display_name, josnObject.lat, josnObject.lon];
      console.log('inserStetment');
      client.query(inserStetment, values)
        .then(insertedRecord => {

          console.log('then');
        }).catch(err => {
          console.log('catch in handelLocation ',err);

        });
      return locationObject;
      // res.status(200).json(locationObject);
    }).catch((error) => {
      res.status(500).json({
        status: 500,
        responseText: 'Sorry, something went wrong',
      });

    });
};



location.LocationInfo=function() {
  console.log('location.currentcitylat');

  return location.currentcitylat;
};


function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;

}


module.exports = location;
