
let superagent = require('superagent');


const YELP_API_KEY = process.env.YELP_API_KEY;

const yelp = {};


yelp.handelYelp = function(currentcity,req,res) {

  let urlYelp = `https://api.yelp.com/v3/businesses/search`;
 
  let page = req.query.page;
  let pagNum = 5;
  let beginnigPage = (page-1)*pagNum;
  const HeaderParameter = {
    terms: 'food',
    limit : 5,
    location: currentcity,
    offset : beginnigPage,
  };
  superagent.get(urlYelp).query(HeaderParameter)
    .set('Authorization', `Bearer ${YELP_API_KEY}`)
    .then(yelpdata => {

      let josnObject = yelpdata.body.businesses;
      let arrayOfyelp = josnObject.map((yelp) => {

        let yelpObj = new Yelp(yelp);
        return yelpObj;

      });
      console.log('arrayOfyelp');
      res.send(arrayOfyelp);


    }).catch(err => {

      res.status(500).send('Error Page in Yelp Handelling',err);
    });

};




//  Yelp Constructor Funcatio
function Yelp(yelpObj) {
  this.name = yelpObj.name;
  this.image_url = yelpObj.image_url;
  this.price = yelpObj.price;
  this.rating = yelpObj.rating;
  this.url = yelpObj.url;

}


module.exports = yelp;

