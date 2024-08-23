import jwt from "jsonwebtoken";

const generateNewAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const refreshTokenHandler = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Signature is required" });
  }
  // token verfication.
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Signature" });
    }
    const newAccessToken = generateNewAccessToken({ id: user.id });
    res.json({ accessToken: newAccessToken });
  });
};
export default refreshTokenHandler;
