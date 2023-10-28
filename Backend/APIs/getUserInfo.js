import { User } from "../models/models.js";


//to fetch the details of user, if user is authenticated, (when client refreshes or relaods the screen )

const getUserInfo = async (userData, authOutput) => {
   
    const userId = authOutput.UserID.userID;    
    let user = await User.findOne({ _id: userId }).select('-password').populate({
        path : 'cart',
        model : 'Cart',
        populate : {
            path : 'items.book',
            model : 'Book'
        }
    });
    return user;

           
};

export default getUserInfo;
