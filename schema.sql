DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY, 
    author VARCHAR(255),
    title VARCHAR(255),
    isbn NUMERIC(15),
    image_url VARCHAR(255),
    description VARCHAR(1000),
    bookshelf VARCHAR(255)
);

INSERT INTO books (author, title, isbn, image_url, description, bookshelf) 
VALUES (
    'Daniel Keyes', 
    'Flowers for Algernon',
    0547539630, 
    'http://books.google.com/books/content?id=_oG_iTxP1pIC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
    'The compelling story of Charlie Gordon, willing victim of a strange experiment - a moron, a genius, a man in search of himself. Poignant, funny, tragic, but with a hope for the indomitable spirit of man, this unusual play tells a story you will long remember. It also offers a magnificent role.',
    'To Read'
);

INSERT INTO books (author, title, isbn, image_url, description, bookshelf) 
VALUES (
    'Lee Child',
    'One Shot',
    0345538196,
    'http://books.google.com/books/content?id=B2qS_L7vJy4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
    'Oscar-winning film Charly starring Cliff Robertson and Claire Bloom-a mentally challenged man receives an operation that turns him into a genius...and introduces him to heartache.',
    'Christmas Books'
);