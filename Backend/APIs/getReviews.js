import jwt from "jsonwebtoken";
import { User,Book } from "../models/models.js";

//getting reviews for a particular book.

const getReviews = async (userData) => {
   
    let reviews = await Book.find({ _id: userData }).select('reviews').populate({
        path : 'reviews',
        model : 'Review',
        populate : {
            path : 'user',
            model : 'User',
            select: 'firstName lastName _id'
        }
    });
    return reviews;

           
};

export default getReviews;
