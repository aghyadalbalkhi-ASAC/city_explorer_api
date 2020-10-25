let express = require('express');

let cors = require('cors');


let app = express();

app.use(cors());

require('dotenv').config();
const PORT = process.env.PORT;



app.get('/location',handelLocation);

function handelLocation (req,res){

    let city = req.query.city;
    let josnData = require('./data/location.json');
    let josnObject = josnData[0];
    let locationObject = new Location(city,josnObject.display_name,josnObject.lat , josnObject.lon);
    res.status(200).json(locationObject);
}

// {
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
//   }

function Location (search_query,formatted_query,latitude,longitude){
this.search_query=search_query;
this.formatted_query=formatted_query;
this.latitude=latitude;
this.longitude=longitude;

}


app.listen(PORT, ()=>{
console.log(`The Port is ${PORT}`);

});






