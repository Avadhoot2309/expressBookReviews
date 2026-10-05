cd ~/expressBookReviews/final_project
cat > router/general.js <<'EOF'
const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = async () => {
  const response = await axios.get('http://localhost:5000/internal/books');
  return response.data;
};

public_users.get('/internal/books', (req, res) => {
  res.status(200).json(books);
});

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

public_users.get('/', async (req, res) => {
  try {
    const data = await getBooks();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({message: "Unable to retrieve books"});
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const data = await getBooks();
    const isbn = req.params.isbn;

    if (!data[isbn]) {
      return res.status(404).json({message: "Book not found"});
    }

    return res.status(200).json(data[isbn]);
  } catch (error) {
    return res.status(500).json({message: "Unable to retrieve book"});
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const data = await getBooks();
    const author = req.params.author.toLowerCase();

    const result = Object.values(data).filter(book =>
      book.author.toLowerCase() === author
    );

    if (result.length === 0) {
      return res.status(404).json({message: "Author not found"});
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({message: "Unable to retrieve books by author"});
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const data = await getBooks();
    const title = req.params.title.toLowerCase();

    const result = Object.values(data).filter(book =>
      book.title.toLowerCase() === title
    );

    if (result.length === 0) {
      return res.status(404).json({message: "Title not found"});
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({message: "Unable to retrieve books by title"});
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
EOF
