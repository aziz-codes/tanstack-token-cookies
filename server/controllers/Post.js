import Post from "../schema/Post.Schema.js";

export const getPosts = async (_, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ count: posts.length, result: posts });
  } catch (err) {
    res.status(500).json({ message: "Server erorr" });
  }
};

export const savePosts = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({
      message: "Title and description cannot by empty",
      success: false,
    });
  }
  try {
    const post = new Post({
      title,
      description,
    });
    await post.save();
    res
      .status(200)
      .json({ message: "Post saved.", success: true, result: post });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server erorr", success: false, error: err.message });
  }
};


export const handleReactPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.body;  
    console.log(user)
    const post = await Post.findById(id);  
    if (!post) {
      return res.status(404).json({ message: "Post not found", id });
    }

    const hasLiked = post.likes.includes(user);  

    if (hasLiked) {
     const updatedLikes =  post.likes.filter((like) => like !== user);
       post.likes = updatedLikes;
       
    } else {
 
      post.likes.push(user);
    }
    await post.save(); 

    // Send the correct response after saving
    res.status(200).json({
      message: hasLiked ? "Like removed" : "Like added",
      post,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
