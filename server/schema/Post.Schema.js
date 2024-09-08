import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'user' }  
    ],
  },
  { timestamps: true }
);

const Post = mongoose.models.post || mongoose.model("post", PostSchema);
export default Post;
