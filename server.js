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

// Testing
app.get('/hello')

// Creates a new search to the googlebooks API
// app.post('searches', createSearch);

// Catch all
app.get('*', (request, response) => response.status(404).send('This route really does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// Helper Function
function newSearch(request, response) {
  response.render('pages/index');
}
