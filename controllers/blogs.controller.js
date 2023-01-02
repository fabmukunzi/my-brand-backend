import blogs from "../models/blogs.model.js";
import newComment from "../models/comments.model.js"
import multer from "multer";
import cloudinary from "cloudinary"
import path from 'path';

//upload an image
// const storageEngine = multer.diskStorage({
//       destination: "./upload",
//       filename: (req, file, cb) => {
//         cb(null, `${Date.now()}--${file.originalname}`);
//       },
//     });
// export const upload = multer({
//       storage: storageEngine,
//     });
//upload using cloudinary
// Configuration 
export default cloudinary.config({
    cloud_name: "dagurahkl",
  api_key: "988891579425932",
  api_secret: "sgQMaPCfxBGkk0DUK6bxQqrUQz8",
  secure:true
  });
  export const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
      let ext = path.extname(file.originalname);
      if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
        cb(new Error("Unsupported file type!"), false);
        return;
      }
      cb(null, true);
    },
  });

//get all blogs
export const getAll=(req,res)=>{
    blogs.find().sort({$natural:-1})
    .then((blog) => res.status(200).json(blog))
    .catch((err) => res.status(400).json({ error: err }));
}
//create a new blog
export const createBlog=async(req,res)=>{
    try{
        const result =await  cloudinary.uploader.upload(req.file.path);
    const post = new blogs({
		title: req.body.title,
        image:result.secure_url,
		content: req.body.content,
        likes:0,
	})
	 post.save()
	res.send({message:"Blog is created!"})
    }catch(err){
        console.log(err)
    }
}
//delete a blog
export const deleteBlog=(req,res)=>{
    const id = req.params.id;
    blogs.findByIdAndDelete(id)
        .then((result) =>
            res.send({message:"Blog has deleted"})
        )
        .catch((err) => res.status(404).json({ error: err, message: "Blog is not found" }));
}
//update blog
export const updateBlog=(req,res)=>{
    const id = req.params.id;
   try{
    blogs.findById(id)
    .then(async(blog) => {
        if (req.body.title) blog.title = req.body.title;
        if(req.file.path){
            const result =await  cloudinary.uploader.upload(req.file.path);
            blog.image=result.secure_url
        } 
        if (req.body.content) blog.content = req.body.content;

        blog.save()
            .then((blog) => res.send({message:"Blog updated!"}))})
            .catch((err) =>
            res
                .status(400)
                .json({ error: err, message: "Blog can't be updated" })
        );
   }
    catch{((err) =>res.status(404).json({error: err,message: "Blog is not found",}))};
}
export const singleBlog=async(req,res)=>{
    const post = await blogs.findOne({ _id: req.params.id })
	if(post){
        res.send({"blog":post})
    }else{
        res.send({message:"Blog is not found"})
    }
}
export const addLike=(req,res)=>{
    const id = req.params.id;
    blogs.findById(id)
        .then((blog) => {
            blog.likes=blog.likes+1;
            blog.likeStatus="Liked"
            blog.save()
                .then((blog) => res.send({message:"Like Added!"}))
        })
        .catch((err) =>
            res.status(404).json({
                message: "Blog is not found",
            })
        ); 
}
export const unlike=(req,res)=>{
    const id = req.params.id;
    blogs.findById(id)
        .then((blog) => {
            if(blog.likes===0){
                blog.likes=blog.likes+1;
                blog.likeStatus="Liked"
                res.send({message:"You can't unlike"})
            }
            else{
                blog.likes=blog.likes-1;
                blog.likeStatus="notLiked"
                res.send({message:"unliked!"})
            }
            blog.save()
        })
        .catch((err) =>
            res.status(404).json({
                message: "Blog is not found",
            })
        );
}
