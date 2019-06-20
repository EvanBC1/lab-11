DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY, 
    author VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255),
    image_url VARCHAR(255),
    description VARCHAR(1000),
    bookshelf VARCHAR(255)
);

INSERT INTO books (author, title, isbn, image_url, description, bookshelf) 
VALUES (
    'Daniel Keyes', 
    'Flowers for Algernon',
    '0547539630', 
    'http://books.google.com/books/content?id=_oG_iTxP1pIC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
    'The compelling story of Charlie Gordon, willing victim of a strange experiment - a moron, a genius, a man in search of himself. Poignant, funny, tragic, but with a hope for the indomitable spirit of man, this unusual play tells a story you will long remember.',
    'To Read'
);

INSERT INTO books (author, title, isbn, image_url, description, bookshelf) 
VALUES (
    'Lee Child',
    'One Shot',
    '0345538196',
    'http://books.google.com/books/content?id=B2qS_L7vJy4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
    'Ex-military investigator Jack Reacher is called in by James Barr, a man accused of a lethal sniper attack that leaves five people dead, and teams up with a young defense attorney to find an unseen enemy who is manipulating events.',
    'Christmas Books'
);