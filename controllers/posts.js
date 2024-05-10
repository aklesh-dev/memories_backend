import mongoose from "mongoose"
import PostMessage from "../models/postMessage.js"

export const getPost = async (req, res) => {
    try {
        const postMessages = await PostMessage.find()

        res.status(200).json(postMessages)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage(post)

    try {
        await newPost.save();
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('NO post with that id ');
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true })

    res.json(updatedPost)
}


export const deletePost = async (req, res) => {
    // Get the ID from the request parameters
    const { id } = req.params;

    // Check if the ID is a valid MongoDB object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No post with that ID found.");
    }

    try {
        // Attempt to find the post by its ID and delete it
        const deletedPost = await PostMessage.findOneAndDelete({ _id: id });

        if (!deletedPost) {
            // If no post found with the given ID, return a 404 status
            return res.status(404).send("No post with that ID found.");
        }

        // If post found and deleted successfully, send success message
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        // If any error occurs during the process, return a 500 status with the error message
        res.status(500).send(error.message);
    }
};

// export const likePost = async (req, res) => {
   
//     // Get the ID from the request parameters
//     const { id } = req.params;

//     // Check if the ID is a valid MongoDB object ID
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(404).send("No post with that ID found.");
//     }

//     const post = await PostMessage.findById(id);
//     const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true }); 
//     res.json(updatedPost);
// }

export const likePost = async (req, res) => {
    try {
        // Get the ID from the request parameters
        const { id } = req.params;

        // Check if the ID is a valid MongoDB object ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send("No post with that ID found.");
        }

        // Find the post by its ID
        const post = await PostMessage.findById(id);
        if (!post) {
            return res.status(404).send("Post not found.");
        }

        // Update the likeCount of the post and return the updated post
        const updatedPost = await PostMessage.findByIdAndUpdate(id, { $inc: { likeCount: 1 } }, { new: true });
        res.json(updatedPost);
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

