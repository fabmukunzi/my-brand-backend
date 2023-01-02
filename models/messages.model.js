import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    names:{
        type:String,
    },
    email:{
        type:String,
    },
    phone:{
        type:String,
    },
    message:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now()
    }
})
const messages=mongoose.model("Messages",messageSchema);
export default messages;