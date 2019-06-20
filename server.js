'use strict'

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

//Application Setup
const app = express();
const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL;

console.log(DATABASE_URL);

// SQL Database Setup
const client = new pg.Client(DATABASE_URL);
client.connect();
client.on('error', error => console.error(error));

//Application Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

//API routes
// Render the search form
app.get('/search', newSearch);
app.get('/', displayFavorites);

//create a new search to the google API
// app.post is meant to copy something
app.post('/searches', createSearch);


// Catch all
app.get('*', (request, response) => response.status(404).send('This route really does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// Helper Function

function Book(info){
  // let httpRegex = /^(http:\/\/)/g
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.image = info.volumeInfo.imageLinks.thumbnail || placeholderImage;
  this.title = info.volumeInfo.title || 'No title available';
  this.authors = info.volumeInfo.authors || 'No author available';
  this.description = info.volumeInfo.description || 'No description available';
  this.url = (security(info.selfLink)) || 'No link available';
}


//securing HTTP
function security(url){
  let regex = /http:/;
  if(regex.test(url)){
    let newURL = url.replace('http:', 'https:');
    return newURL;
  } else {
    return url;
  }
}

function newSearch(request, response) {
  response.render('pages/searches/searches-new');
}

function createSearch (request, response){
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  console.log('request body', request.body);
  console.log('actual search', request.body.search);



  if (request.body.search[1] === 'title') {url += `+intitle:${request.body.search[0]}`}
  if (request.body.search[1] === 'author') {url += `+inauthor:${request.body.search[0]}`}

  
  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult)))
    .then(apiResponse => response.render('pages/searches/show', {searchResults : apiResponse }))
    .catch(error => handleError(error, response));

}

function displayFavorites(request, response) {
  console.log('params', request.params);

  let SQL = `SELECT * FROM books`;

  return client.query(SQL)
    .then(results => {
      // let favorites = results.rows[0]
      console.log('!!!!!!!!!', results.rows);
      response.render('pages/index', {favorite: results.rows});
    })
}

function handleError (error, response){
  console.error(error);
  response.status(500).send('ERROR');
}