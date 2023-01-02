// import comments from "../models/comments.model.js";
// import blogs from "../models/blogs.model.js";

// export const addComment = (req, res) => {
//     const id= req.params.id;
//     const comment = new comments({
//         names: req.body.names,
//         comment: req.body.comment,
//         blog_id: id,
//     });
//     const blog = blogs.findOne(id);
//     if (blog) {
//         comment
//             .save()
//             .then(async (data) => {
//                 await blogs.findByIdAndUpdate(id, {
//                     $push: { comments: data._id },
//                 });
//                 return res.send("Comment has been added");
//             })
//             .catch((err) =>
//                 res
//                     .status(404)
//                     .json({ error: err, message: "Comment not added" })
//             );
//     } else return res.status(404).json({ error: "Blog not found" });
// };

// export const comment_list = (req, res) => {
//     const blogId = req.params.id;
//     blogs.findOne({ _id: blogId })
//         .then(
//             const comm=comments.find()
//         )
// };