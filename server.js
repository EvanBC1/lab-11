'use strict'

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

// Environment Variables
require('dotenv').config();

//Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

//Application Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

//API routes
// Render saved books from database
app.get('/', (request, response) => {
  let SQL = `SELECT * FROM books`;
  return client.query(SQL)
    .then(results => {
      response.render('pages/index', {resultsBanana: results.rows});
    })
});

//Create search page
app.get('/new', newSearch);

//create a new search to the google API
app.post('/searches', createSearch);

//Create book details page
// app.get('/books/:id', (request, response) => {
//   let SQL = `SELECT * FROM books WHERE id=${request.params.id};`;
//   return client.query(SQL)
//     .then(response => response.render('pages/searches/detail', {bookDetail: result.rows[0]})) // CHECK THIS
//     .catch(error => console.error(error));
// });

// Catch all
app.get('*', (request, response) => response.status(404).send('This route really does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// Helper Function

function Book(info){
  let httpRegex = /^(http:\/\/)/g;
  let placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.title ? info.title : 'No title available';
  this.authors = info.authors ? info.authors : 'No author available';
  this.isbn = info.industryIdentifiers ? `ISBN ${info.industryIdentifiers[0].identifier}` : 'No ISBN available';
  this.image_url = info.imageLinks ? info.imageLinks.smallThumbnail.replace(httpRegex, 'https://') : placeholderImage;
  this.description = info.description ? info.description : 'No description available';
}

function newSearch(request, response) {
  response.render('pages/searches/new');
}

function createSearch (request, response){
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';


  console.log('request body', request.body);
  console.log('actual search', request.body.search);

  if (request.body.search[1] === 'title') {url += `+intitle:${request.body.search[0]}`}
  if (request.body.search[1] === 'author') {url += `+inauthor:${request.body.search[0]}`}

  superagent.get(url)
    // .then(response => console.log('RESPONSE', response))
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => response.render('pages/searches/show', {searchResults : results}))
    .catch(error => handleError(error, response));

}

function handleError (error, response){
  console.error(error);
  response.status(500).send('ERROR');
}
