import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        names: {
            type: String,
        },
       comment: {
            type: String,
        },
        blog_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "blogs.model.js",
        },
        date:{
            type:Date,
            default:Date.now()
        }
    }
);

const newComment = mongoose.model("comments", commentSchema);
export default newComment;
