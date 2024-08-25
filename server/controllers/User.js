import User from "../schema/User.schema.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();


  const refreshTokenExp = "3min";
  const accessTokenExp = "2min";

export const fetchUsers = async (_, res) => {
   try{
    const users = await User.find();
    if(!users){
      res.status(200).send({message: "no user found",status:200})
    }
    res.status(201).send({message: "users","count":users.length,results:users})
   }
   catch(err){
    console.log(err);
    res.status(500).send({message: "internal server error",status:500})
   }
};

export const saveUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({
      email,
      password,
    });
    await user.save();
    res.send({ message: "User saved", result: user, status: 200 });
  } catch (err) {
    res.send({ message: err.message, status: 400 });
  }
};
export const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email,password });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password", status: 401 });
    }

    // Assuming password comparison is done using bcrypt or another method
    
    // Generate tokens
    const JWT_SECRET = process.env.JWT_SECRET;
    const authToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: accessTokenExp });
    const refreshAuthToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: refreshTokenExp });
    const combinedToken = `${authToken}${process.env.SPLITTER}${refreshAuthToken}`
    // Set cookies
    res.cookie('ds', combinedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 2 * 60 * 1000, // 2 minutes in milliseconds
    });
 

    // Send response
    res.status(200).json({
      message: "Login successful",
      status: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, status: 500 });
  }
};
