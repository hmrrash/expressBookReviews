const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let bookPromise = new Promise((resolve, reject) => {
       resolve(JSON.stringify(books,null,4))
    })
    bookPromise.then((successMessage) => {
        return res.send(successMessage);
    })  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbnPromise = new Promise((resolve, reject) => {
        const isbn = parseInt(req.params.isbn);
        if (isbn > 0)
            {
                resolve(JSON.stringify(books[isbn],null,4))
            }
        else{
                resolve("Invalid ISBN")
        }
    })
    isbnPromise.then((successMessage) =>{
        return res.send(successMessage)
    })
  
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorPromise = new Promise((resolve,reject) => {
        const author = req.params.author;
        if (author.length > 0) {
            let keys = Object.keys(books);
            let authbooks = []
            for (const key of keys) {
                if (books[key].author === author) {
                    authbooks.push(books[key])
                }
            }
            resolve(JSON.stringify(authbooks,null,4))      
        }
        
    })
    authorPromise.then((successMessage) =>{
        return res.send(successMessage)
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let titlePromise = new Promise((resolve, reject) => {
        const title = req.params.title;
        if (title.length > 0){
            let keys = Object.keys(books);
            let titlebooks = []    
            for (const key of keys) {
                if (books[key].title === title) {
                    titlebooks.push(books[key])
                    console.log(books[key])
                }
            }
            if (titlebooks.length > 0) {
                resolve(JSON.stringify(titlebooks,null,4));
            }
            else {
                resolve("Book not found")
            }
        }})
    titlePromise.then((successMessage) => {
        return res.send(successMessage)
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  if (isbn) {
      book = books[isbn];
      res.send(book.reviews)
    }
});

module.exports.general = public_users;
