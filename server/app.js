import express from "express";
import cors from "cors";
import { connect } from "./utils/connection.js";
// user route
import UserRoutes from "./routes/User.js";
// posts route
import PostRoutes from "./routes/Posts.js";
import VerifyToken from "./middlewares/token-auth.js";
import refreshTokenHandler from "./controllers/Auth.js";
// Test routes

import TestRoutes from './routes/Test.js';
const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use("/users", UserRoutes);
app.use("/posts", PostRoutes);
app.post("/token/refresh", refreshTokenHandler);
app.use('/test',TestRoutes);
app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});

connect();

app.get("/", (_, res) => {
  res.send({ message: "Hello from server", status: "Active" });
});
