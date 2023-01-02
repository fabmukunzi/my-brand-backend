import express from "express";
import {
	getAll,
	createBlog,
	singleBlog,
	updateBlog,
	deleteBlog,
	addLike,
	unlike,
} from "../controllers/blogs.controller.js"
import {	addComment,getComments} from "../controllers/comments.controller.js"
import blogValidation from "../validations/blogs.validation.js";
import commentValidation from "../validations/comments.validations.js";
import { authenticate } from "../auth/auth.js";
import cloudinary from "../controllers/blogs.controller.js"
import {upload} from "../controllers/blogs.controller.js";

 const router = express.Router()

// Get all posts
router.get("/", getAll)
//create post
router.post("/",authenticate,upload.single("image"),blogValidation, createBlog)
//get one
router.get("/:id", singleBlog)
//update post
router.patch("/:id",authenticate,upload.single("image"),blogValidation, updateBlog)
//delete post
router.delete("/:id",authenticate,deleteBlog)
//likes
router.post("/:id/addLike", addLike)
router.post("/:id/unlike", unlike)
//comments
router.post("/:id/comments",commentValidation, addComment)
router.get("/:id/comments", getComments)
//router.delete("/:id/comments/:cid", deleteComment)
export default router;