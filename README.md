# Open Shelf: A Book Wiki

**Author**: Evan Brecht-Curry and Lillian Gales
**Version**: 1.0.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview
Open shelf is a full stack application for a book list. Features include the ability to seach the Google Books API, add books to a database, and then render these books from a PostgresSQL database. 

## Getting Started
Heroku link: https://lab-11-eal.herokuapp.com/
Database link: postgres://dtbyiexfugqbjn:5334eac43fb95e435024bf0dcf42bd1c9cdec994cdcbc950c54555091a518dac@ec2-174-129-27-158.compute-1.amazonaws.com:5432/dd71n6gnafrjad

## Architecture
Languages: JavaScript, HTML & CSS
Libraries: PostgresSQL, EJS, superagent

## Change Log

Day 1:
Ability to search the Google Books API and render top 10 search results on that page

## Heroku Link
https://lab-11-eal.herokuapp.com/

## book Schema
books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description VARCHAR(255),
  bookshelf VARCHAR(255)
);

## Credits and Collaborations

Number and name of feature: Day 2 Feature 1 - Saved books

Estimate of time needed to complete: 2hr

Start time: 9:50am

Finish time: 1:30pm

Actual time needed to complete: 3:40

Number and name of feature: Day 2 Feature 2 - View Book Details 

Estimate of time needed to complete: 2hrs

Start time: _____

Finish time: _____

Actual time needed to complete: _____
