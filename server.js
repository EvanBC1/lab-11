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

function Book(info){
  let httpRegex = /^(http:\/\/)/g;
  let placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.title ? info.title : 'No title available';
  this.authors = info.authors ? info.authors : 'No author available';
  this.isbn = info.industryIdentifiers ? `ISBN ${info.industryIdentifiers[0].identifier}` : 'No ISBN available';
  this.image_url = info.imageLinks ? info.imageLinks.smallThumbnail.replace(httpRegex, 'https://') : placeholderImage;
  this.description = info.description ? info.description : 'No description available';
}

// function security(url){
//   let regex = /http:/;
//   if(regex.test(url)){
//     let newURL = url.replace('http:', 'https:');
//     return newURL;
//   } else {
//     return url;
//   }
// }

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
    // .then(response => console.log('RESPONSE', response))
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => response.render('pages/searches/show', {searchResults : results}))
    .catch(error => handleError(error, response));

}

function handleError (error, response){
  console.error(error);
  response.status(500).send('ERROR');
}
