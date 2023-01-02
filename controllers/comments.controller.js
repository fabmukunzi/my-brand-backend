import newComment from "../models/comments.model.js"
import blogs from "../models/blogs.model.js";


export const addComment=async(req,res)=>{
    const blogId = req.params.id;
    const comment = new newComment({
        names: req.body.names,
        comment: req.body.comment,
        blog_id: blogId,
    });
    const post = await blogs.findOne({ _id: req.params.id })
if(post){
    comment
        .save()
        .then(async (data) => {
            await blogs.findByIdAndUpdate(blogId, {
                $push: { comments: data._id },
            });
        })
    res.send({message:"Comment added!"})
}else{
    res.send({message:"Blog is not found"})
}
};
export const getComments = async(req, res) => {
    const blogId = req.params.id;
    const post=blogs.findOne({ _id: blogId })
    blogs.findOne({ _id: blogId })
        .then(async (blog) => {
           if(blog){
            const comments = [];
            const blogComments = blog.comments;
            for (let i = 0; i < blogComments.length; i++) {
                const blogComment = await newComment.findById(blogComments[i]);
                comments.push(blogComment);
            }
            res.send(comments);
           }else{
            res.send({message:"Blog is not found"})
           }
        })
};
// export const deleteComment=async(req,res) =>{
//     try {       
//         if (req.params.type === "comment") {
//             await blogs.updateMany({ id: ObjectId(req.params.id), type: 'Blogs' }, { $pull: { 'children': ObjectId(req.params.id) } });
//             await newComment.updateMany({ id: ObjectId(req.params.cid) }, { $pull: { 'comments': ObjectId(req.params.cid) } });
//         }
//         await blogs.findByIdAndDelete(ObjectId(req.params.id));
//         return res.status(http_status.OK).json({ message: `${req.params.type} deleted successfully` });
//     } catch (err) {
//         return res.send(err);
//     }
// }