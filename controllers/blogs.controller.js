import blogs from "../models/blogs.model.js";
import newComment from "../models/comments.model.js"
//get all blogs
export const getAll=(req,res)=>{
    blogs.find()
    .then((blog) => res.status(200).json(blog))
    .catch((err) => res.status(400).json({ error: err }));
}
//create a new blog
export const createBlog=(req,res)=>{
    const post = new blogs({
		title: req.body.title,
		content: req.body.content,
        likes:0,
	})
	 post.save()
	res.send("Blog is created!")
}
//delete a blog
export const deleteBlog=(req,res)=>{
    const id = req.params.id;
    blogs.findByIdAndDelete(id)
        .then((result) =>
            res.send("Blog has deleted")
        )
        .catch((err) => res.status(404).json({ error: err, message: "Blog is not found" }));
}
//update blog
export const updateBlog=(req,res)=>{
    const id = req.params.id;
    blogs.findById(id)
        .then((blog) => {
            if (req.body.title) blog.title = req.body.title;
            if (req.body.content) blog.content = req.body.content;

            blog.save()
                .then((blog) => res.send("Blog updated!"))
                .catch((err) =>
                    res
                        .status(400)
                        .json({ error: err, message: "Blog can't be updated" })
                );
        })
        .catch((err) =>
            res.status(404).json({
                error: err,
                message: "Blog is not found",
            })
        );
}
export const singleBlog=(req,res)=>{
    try {
		const id = req.params.id;
    blogs.findById(id)
        .then((blog) => res.status(200).json(blog))
        .catch((err) => res.status(404).json({ error: err, message: "Blog is not found" }));
	} catch {
		res.status(404)
		res.send({ error: "Blog doesn't exist!" })
	}
}
export const addLike=(req,res)=>{
    const id = req.params.id;
    blogs.findById(id)
        .then((blog) => {
            blog.likes=blog.likes+1;
            blog.save()
                .then((blog) => res.send("Like Added!"))
        })
        .catch((err) =>
            res.status(404).json({
                error: err,
                message: "Blog is not found",
            })
        ); 
}
export const unlike=(req,res)=>{
    const id = req.params.id;
    blogs.findById(id)
        .then((blog) => {
            if(blog.likes==0){
                res.send("You can't unlike")
            }
            else{
                blog.likes=blog.likes-1;
                res.send("unliked!")
            }
            blog.save()
        })
}
export const addComment=(req,res)=>{
        const blogId = req.params.id;
        const comment = new newComment({
            names: req.body.names,
            comment: req.body.comment,
            blog_id: blogId,
        });
        const blog = blogs.findOne(blogId);
        if (blog) {
            comment
                .save()
                .then(async (data) => {
                    await blogs.findByIdAndUpdate(blogId, {
                        $push: { comments: data._id },
                    });
                    return res.send("Comment is added!");
                })
        } else return res.status(404).json({ error: "Blog not found" });
    };
    export const getComments = (req, res) => {
        const blogId = req.params.id;
        blogs.findOne({ _id: blogId })
            .then(async (blog) => {
                const comments = [];
                const blogComments = blog.comments;
                for (let i = 0; i < blogComments.length; i++) {
                    const blogComment = await newComment.findById(blogComments[i]);
                    comments.push(blogComment);
                }
                res.status(200).json(comments);
            })
    };