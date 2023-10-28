import { Cart, User, Book } from "../models/models.js";

//updating the cart, quantity,

const updateCart = async (userData, authOutput) => {
   
    const bookId = userData.bookID;
    const quantity = userData.quantity;
    const userId = authOutput.UserID.userID; // User ID from the JWT token

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return {
                Success: false,
                Message: "No Cart is associated to the user."
            }
        }
        let updatedQuantity;
        let temp = cart.items.map((item) => {
            if (item.book.equals(bookId)) {
                item.quantity += quantity;
                updatedQuantity = item.quantity;
                return item; 
            }
            return item; 
        });
        cart.items = temp;
        let cart_id = cart._id;
        await cart.save();

        if (updatedQuantity <= 0) {
            //if item has 0 quantity then removing that item(book) from the cart.
            cart.items = cart.items.filter(item => !item.book.equals(bookId));
            await cart.save();
        }

        if (cart.items.length === 0) {
            //if cart has no books remaining, then deteling that cart
            const deletedDocument = await Cart.findByIdAndRemove(cart_id);

            //further removing the reference of that cart from the user.
            await User.findOneAndUpdate({ _id: userId },
                { $unset: { cart: 1 } },
                { new: true },)

        }

      
        return {
            Success: true,
            CartDetail: cart,
        }
    } catch (error) {
        return {
            Success: false,
            Error: error.message,
        }
    };
}

export default updateCart;
