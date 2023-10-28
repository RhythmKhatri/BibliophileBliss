import jwt from "jsonwebtoken";
import  {User}  from "../models/models.js";

//verifying if user didn't exsists, then adding user to the databse.

const signUp = async (params) => {
  const secret = process.env.JWT_SECRET;

  const checkIfAlreadyExists = await User.find({ email: params.email });

  if (checkIfAlreadyExists.length > 0) {
    return {
      Success: false,
      Message: 'User Already Exist.'
    };
  }

  const data = new User({
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    password: params.password,
    role: "normal"
  });

  try {
    const savedData = await data.save();
    const token = jwt.sign({ userID: savedData._id }, secret, { expiresIn: '1h' });

    return {
        Success : true,
        Message : "Signed Up Successfully.",
        token : token,
        
    };
  } catch (error) {
    return {
      Success : false,
      Message : error.message,
      
  };
  }
};

export default signUp;
