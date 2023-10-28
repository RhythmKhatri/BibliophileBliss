import { Cart, User } from "../models/models.js";




const addToCart = async (userData, authOutput) => {
    

    const bookId = userData.bookID;
    const quantity = userData.quantity;
    const userId = authOutput.UserID.userID; // User ID from the JWT token
    //Adding book to the user's cart
    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        cart.items.push({ book: bookId, quantity: quantity });
        await cart.save();

        let user = await User.findOne({ _id: userId });
        user.cart = cart;
        await user.save();

        return {
            Success: true,
            CartDetail: cart,
        }
    } catch (error) {
        return {
            Success: false,
            Error: error,
        }
    };
}

export default addToCart;
