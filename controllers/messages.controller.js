import messages from "../models/messages.model.js"
export const addMessage=(req, res)=>{
    const message=new messages({
        names:req.body.names,
        email:req.body.email,
        phone:req.body.phone,
        message:req.body.message
    });
    message
          .save()
          .then((data)=>{res.send("Message has been sent")})
}
export const getMessages=(req,res)=>{
    messages.find()
            .then((message)=>{
                res.send(message)
            })
}
export const singleMessage=(req,res)=>{
    const id=req.params.id;
    messages.findById(id)
            .then((message)=>{
                res.send(message)
            })
}