let superagent = require('superagent');
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;


const movie ={};

movie.handelMovies = function(currentcity,req,res) {

  let urlmovie = `https://api.themoviedb.org/4/search/movie?api_key=${MOVIE_API_KEY}&query=${currentcity}`;
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

};


//  Movies Constructor Funcatio
function Movies(movie) {
  this.title = movie.title;
  this.overview = movie.overview;
  this.average_votes = movie.title;
  this.total_votes = movie.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  this.popularity = movie.popularity;
  this.released_on = movie.release_date;

}

module.exports = movie;
