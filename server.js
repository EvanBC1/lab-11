'use strict'

// Application Dependencies
const express = require('express');
const superagent = require('superagent')

//Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

//Application Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

//API routes
// Render the search form
app.get('/', newSearch);

//create a new search to the google API
app.post('/searches', createSearch);

// Testing
app.get('/hello')

// Catch all
app.get('*', (request, response) => response.status(404).send('This route really does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// Helper Function
function newSearch(request, response) {
  response.render('pages/index');
}

function createSearch (request, response){
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  console.log('hello!')

  console.log(request.body);
  console.log(request.body.search);
  
  if (request.body.search[1] === 'title') {url += `+intitle:${request.body.search[0]}`}
  if (request.body.search[1] === 'author') {url += `+inauthor:${request.body.search[0]}`}

  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    // .then(results => response.render('pages/searches/show', {searchResults : results}))
    .catch(error => handleError(error, response));

}

// function Book(bookInfo){
//   this.title = 
// }

function handleError (error, response){
  console.error(error);
  response.status(500).send('ERROR');
}
