import express from "express";
import {
	getAll,
	createBlog,
	singleBlog,
	updateBlog,
	deleteBlog,
	addLike,
	unlike,
	addComment,
	getComments,
} from "../controllers/blogs.controller.js"
import blogValidation from "../validations/blogs.validation.js";
import commentValidation from "../validations/comments.validations.js";


 const router = express.Router()

// Get all posts
router.get("/", getAll)
//create post
router.post("/",blogValidation, createBlog)
//get one
router.get("/:id", singleBlog)
//update post
router.patch("/:id",blogValidation, updateBlog)
//delete post
router.delete("/:id", deleteBlog)
//likes
router.post("/addLike/:id", addLike)
router.post("/unlike/:id", unlike)
//comments
router.post("/comments/:id",commentValidation, addComment)
router.get("/comments/:id", getComments)
export default router;