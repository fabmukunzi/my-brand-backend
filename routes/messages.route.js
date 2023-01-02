import express from "express";
import messageValidation from "../validations/messages.validation.js"
import {addMessage, getMessages, singleMessage} from "../controllers/messages.controller.js";

const msgRouter=express.Router();
msgRouter.post("/",messageValidation, addMessage);
msgRouter.get("/", getMessages);
msgRouter.get("/:id", singleMessage);
export default msgRouter;