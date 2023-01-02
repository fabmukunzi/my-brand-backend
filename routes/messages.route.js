import express from "express";
import messageValidation from "../validations/messages.validation.js"
import {addMessage, deleteMessage, getMessages, singleMessage} from "../controllers/messages.controller.js";
import {authenticate} from "../auth/auth.js";

const msgRouter=express.Router();
msgRouter.post("/",messageValidation, addMessage);
msgRouter.get("/",authenticate, getMessages);
msgRouter.get("/:id",authenticate, singleMessage);
msgRouter.delete("/:id",authenticate, deleteMessage)
export default msgRouter;