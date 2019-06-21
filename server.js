'use strict'

// Application Dependencies
// express is a framework that gives access to routes that we use to access our services
const express = require('express');
// superagent handles all requests
const superagent = require('superagent');
const pg = require('pg');
// add our environment configuration
require('dotenv').config();
const methodOverride = require('method-override');

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
//handles/parses our request body so we can access our request.body
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in urlencoded POST bodies and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

//API routes
app.get('/search', newSearch);
app.get('/', displayFavorites);
app.post('/searches', renderSearch);
app.get('/books/:id', viewFavoritedDetails);
app.get('/view-details', viewDetails);
app.post('/books', addFavorites);

// Catch all
app.get('*', (request, response) => response.status(404).send('This route really does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// Helper Function
function Book(info){
  // let httpRegex = /^(http:\/\/)/g
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.image_url = info.volumeInfo.imageLinks.thumbnail || placeholderImage;
  this.title = info.volumeInfo.title || 'No title available';
  this.authors = info.volumeInfo.authors || 'No author available';
  this.description = info.volumeInfo.description || 'No description available';
  this.url = (security(info.selfLink)) || 'No link available';
  this.isbn = info.volumeInfo.industryIdentifiers[0].identifier || 'No isbn available';
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

function renderSearch (request, response){
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

// retrieving books from db
function getBooks(request, response){
  let SQL = 'SELECT * FROM books'

  return client.query(SQL)
    .then(results => {
      if (results.rows.rowCount === 0){
        response.render('pages/searches-new')
      } else {
        resizeBy.render('pages/index', {books: results.rows});
      }
    })
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

function viewFavoritedDetails (request, response){
  // params forms a key value pair, in the case of ID 1 id:1
  let SQL = `SELECT * FROM books WHERE id=${request.params.id};`;

  return client.query(SQL)
    .then(result => {
      return response.render('pages/books/show', {book: result.rows[0]});
    })
    .catch(err => handleError(err, response));
}

function viewDetails(request, response){
  return response.render('pages/searches/view-details')
}

function addFavorites (request, response) {
  console.log('!!!!!',request.body);
  let {title, authors, isbn, image_url, description, bookshelf} = request.body;
  let SQL = `INSERT INTO books(title, authors, isbn, image_url, description, bookshelf) VALUES  ($1, $2, $3, $4, $5, $6) RETURNING id;`;
  let values = [title, authors, isbn, image_url, description, bookshelf];

  return client.query(SQL, values)
    .then(result => {
      response.redirect(`/books/${result.rows[0].id}`) 
    })
    .catch(err => handleError(err, response));
}


function handleError (error, response){
  console.error(error);
  response.status(500).send('ERROR');
}

// $('.select-button').on('click', function(){
//   $(this).next().removeClass('hide-me');
// });

