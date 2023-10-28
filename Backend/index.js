import fs from "fs";
import csv from "csv-parser";
import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import getBooks from "./APIs/getBooks.js"
import signUp from "./APIs/signUp.js";
import signIn from "./APIs/signIn.js";
import dotenv from 'dotenv';
import checkAuth from "./APIs/checkAuth.js";
import addToCart from "./APIs/addToCart.js";
import updateCart from "./APIs/updateCart.js";
import getUserInfo from "./APIs/getUserInfo.js";
import getHomepageBooks from "./APIs/getHomepageBooks.js";
import addReview from "./APIs/addReview.js";
import getReviews from "./APIs/getReviews.js";


const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;
app.use(cors({
  origin: ['http://localhost:3000', 'https://bibliophilebliss.netlify.app'],
  methods: 'GET,POST,PUT',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/getBooks', async (request, response) => {
  const res = await getBooks(request.query);
  return response.json(res);

})

app.post('/signUp', async (request, response) => {
  const userData = request.body;

  const res = await signUp(userData);
  return response.json(res);

});

app.post('/signIn', async (request, response) => {
  const userData = request.body;

  const res = await signIn(userData);
  return response.json(res);

});

app.post('/signOut', async (request, response) => {

  const authOutput = checkAuth(request);

  return response.json(authOutput);

});

app.post('/addToCart', async (request, response) => {
  const userData = request.body;

  const authOutput = checkAuth(request);
  if(authOutput.Success === false) return response.json(authOutput)
  
  const res = await addToCart(userData,authOutput);
  return response.json(res);

});

app.post('/addReview', async (request, response) => {
  const userData = request.body;
 
  const authOutput = checkAuth(request); 
  if(authOutput.Success === false) return response.json(authOutput)
  const res = await addReview(userData,authOutput);
  return response.json(res);

});

app.put('/addToCart', async (request, response) => {
  const userData = request.body;
  const authOutput = checkAuth(request);
  if(authOutput.Success === false) return authOutput;
  const res = await updateCart(userData,authOutput);
  return response.json(res);

});

app.get('/getReviews/:bookID', async (request, response) => {
  
  const userData = request.params.bookID;
  
  const res = await getReviews(userData);
  
  return response.json(res);

});


app.get('/getUserInfo', async (request, response) => {
  const userData = request.query;
  const authOutput = checkAuth(request);
  if(authOutput.Success === false) {
    return response.json(authOutput);
  }
  const res = await getUserInfo(userData,authOutput);
  return response.json(res);

});

app.get('/getHomepageBooks', async (request, response) => {

  const res = await getHomepageBooks(request.query);
  
  return response.json(res);

})
const database_url=process.env.DATABASE_URL;
mongoose.connect(database_url).then(() => {

}).catch((error) => {
  
})



// Read the CSV file and save the data to MongoDB
// fs.createReadStream('bookseed.csv')
//   .pipe(csv())
//   .on('data', (row) => {
//     // Create a new document using the model
//     const data = new Book({
//       title:  row.title,
//       author:   row.authors,
//       isbn:   parseInt(row.isbn),
//       num_pages:   parseInt(row.num_pages),
//       price:   parseInt(row.price),
//       quantity:   parseInt(row.quantity),
//       inStock:   true,
//       language:   row.language_code,
//       publisher:   row.publisher,
//     });

//     // Save the document to the database
//     data.save()
//       .then(() => {

//       })
//       .catch((error) => {

//       });
//   })



app.listen(PORT, () => {
  
})  