import jwt from "jsonwebtoken";
import { User } from "../models/models.js";


//verifying the user authenticity and assigning the jwt token with the user, which can be used to access protected api's

const signIn = async (params) => {
    const secret = process.env.JWT_SECRET;

    try {
        const checkIfAlreadyExists = await User.find({ email: params.email }).populate({
            path : 'cart',
            model : 'Cart',
            populate : {
                path : 'items.book',
                model : 'Book'
            }
        });


        if (checkIfAlreadyExists.length > 0 && checkIfAlreadyExists[0].password === params.password) {

            const token = jwt.sign({ userID: checkIfAlreadyExists[0]._id }, secret, { expiresIn: '1h' });
            return {
                Success : true,
                Message : "Logged in Successfully.",
                Token : token,
                User : checkIfAlreadyExists[0],
            }
        } else {
            return {
                Success : false,
                Message : "Authentication Failed"
            }
        }
    } catch (error) {
        return {
            Success : false,
            Message : error.message
        }
    }
};

export default signIn;
