import User from "../schema/User.schema.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
export const fetchUsers = async (_, res) => {
  res.send({ message: "All users" });
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
    // Check if user exists and verify password
    const user = await User.findOne({ email, password });
    if (!user) {
      // Assume password comparison is done elsewhere
      return res
        .status(401)
        .send({ message: "Invalid email or password", status: 401 });
    }

    // Generate tokens

    const JWT_SECRET = process.env.JWT_SECRET;
    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: 60 * 10,
    });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: 3600 * 24,
    });

    res.send({
      message: "Login successful",

      accessToken,
      refreshToken,

      status: 200,
    });
  } catch (err) {
    res.status(500).send({ message: err.message, status: 500 });
  }
};
