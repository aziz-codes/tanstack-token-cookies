import jwt from 'jsonwebtoken';
const token = 'your_jwt_here';
const secret = 'your_secret_key';
import dotenv from 'dotenv';

dotenv.config();

jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmEwYTZlYWRkYWVmNmUxY2I2NjA5YzkiLCJpYXQiOjE3MjQ3OTA5NzAsImV4cCI6MTcyNDc5MTg3MH0.wnwufFnv-6aI6CFF0CopXj_idDJBtA8MgLX6ZNI9vps", process.env.JWT_SECRET, (err, decoded) => {
  if (err) {
    console.log('Invalid token:', err);
  } else {
    console.log('Decoded payload:', decoded);
  }
});