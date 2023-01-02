import mongoose from "mongoose"

const schema = mongoose.Schema({
	title: String,
	content: String,
    date: { 
        type:Date,
        default: Date.now()},
    image:String,
    likeStatus:{
        type:String,
        default:"notLiked"
    },
    likes: Number,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
})

const blogs = mongoose.model("Blogs", schema)
export default blogs