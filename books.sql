DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description VARCHAR(255),
  bookshelf VARCHAR(255)
);

INSERT INTO books (title, author, isbn, image_url, description, bookshelf)
VALUES('Lord of the wings', 'GRR Tolken', '12345', 'https://i.imgur.com/J5LVHEL.jpg', 'Harry potter must throw the one ring at the night king', 'something stupid');

INSERT INTO books (title, author, isbn, image_url, description, bookshelf)
VALUES('game of bones', 'something martin', '12345', 'https://i.imgur.com/J5LVHEL.jpg', 'gotta find the bone king', 'aaa');