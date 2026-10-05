const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users.some(user => user.username === username)) {
    return res.status(400).json({message: "User already exists"});
  }

  users.push({username, password});
  return res.status(200).json({message: "User successfully registered"});
});

public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({message: "Book not found"});
});

public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const result = Object.values(books).filter(book =>
    book.author.toLowerCase() === author.toLowerCase()
  );
  return res.status(200).json(result);
});

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const result = Object.values(books).filter(book =>
    book.title.toLowerCase() === title.toLowerCase()
  );
  return res.status(200).json(result);
});

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
