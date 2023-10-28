import mongoose from 'mongoose';
//Book schema having necesary details and reviews references
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  isbn: Number,
  num_pages: Number,
  price: Number,
  quantity: Number,
  inStock: Boolean,
  language: String,
  publisher: String,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],

});

export const Book = mongoose.model('Book', bookSchema);

//user schema having necesary details and cart reference
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  });
  
  export const User = mongoose.model('User', userSchema);

  //cart schema having necesary details and reference to user and books
const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
          book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
          quantity: Number,
        },
      ],
})

export const Cart = mongoose.model('Cart', cartSchema);

//review schema having necesary details and reference to user 
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 0, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now },
});

export const Review = mongoose.model('Review', reviewSchema);
