import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // check the header for auth

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    // verify the token.
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invallid signature" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "No signature attached" });
  }
};

export default verifyToken;
