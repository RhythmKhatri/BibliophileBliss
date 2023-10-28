import jwt from "jsonwebtoken";

const checkAuth = (request) => {
 
    const secret = process.env.JWT_SECRET;
    if(request.headers.authorization === undefined || request.headers.authorization === 'undefined'){
      return {
        Success : false,
        Message : "Please Provide Authorization Header."
      }
    }
    //verifying token and fetching user._id from it.
    try {

      const token = request.headers.authorization ;
      const decoded = jwt.verify(token, secret);
      return {
        Success : true,
        UserID : decoded,

      }
    } catch (error) {
      return {
        Success : false,
        Message : error.name === "TokenExpiredError" ? "You need to login to proceed" : error.name
      }
    }
  };

export default checkAuth;