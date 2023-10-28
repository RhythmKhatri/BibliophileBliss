import { Cart, User,Book,Review } from "../models/models.js";


const addReview = async (userData, authOutput) => {
   
    const bookId = userData.newReview.bookID;
    const comment = userData.newReview.comment;
    const rating = userData.newReview.rating;
    const userId = authOutput.UserID.userID; // User ID from the JWT token

    try {
// adding a review
        const data = new Review({
            user: userId,
            comment: comment,
            rating : rating,
            
          });
          const savedData = await data.save();
         //connecting book with the review
          let book = await Book.find({_id : bookId});
          if(book.length > 0 && book[0].reviews && book[0].reviews.length>0){
            book[0].reviews.push(savedData._id);

          }
          else if(book.length > 0 && book[0].reviews){
            book[0].reviews=[];
            book[0].reviews.push(savedData._id);
          }
          let newBook = await book[0].save();
          return {
            Success : true
          }
        
        
    } catch (error) {
        return {
            Success: false,
            Error: error,
        }
    };
}

export default addReview;
