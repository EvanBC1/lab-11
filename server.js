'use strict'

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

//Application Setup
const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

// SQL Database Setup
const client = new pg.Client(DATABASE_URL);
client.connection();
client.on('error', error => console.error(error));

//Application Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

//API routes
// Render the search form
app.get('/', newSearch);

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
  response.render('pages/index');
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

// function cacheBooks(request, client) {
//   const insertSQL = `INSERT INTO`
// }

function handleError (error, response){
  console.error(error);
  response.status(500).send('ERROR');
}
