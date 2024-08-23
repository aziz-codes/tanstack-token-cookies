import express from "express";
import cors from "cors";
import { connect } from "./utils/connection.js";
// user route
import UserRoutes from "./routes/User.js";
// posts route
import PostRoutes from "./routes/Posts.js";
import VerifyToken from "./middlewares/token-auth.js";
import refreshTokenHandler from "./controllers/Auth.js";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use("/users", UserRoutes);
app.use("/posts", VerifyToken, PostRoutes);
app.post("/token/refresh", refreshTokenHandler);
app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});

connect();

app.get("/", (_, res) => {
  res.send({ message: "Hello from server", status: "Active" });
});
