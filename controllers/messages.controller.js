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
          .then((data)=>{res.send({message:"Message has been sent"})})
}
export const getMessages=(req,res)=>{
    messages.find()
            .then((message)=>{
                res.send({messages:message})
            })
}
export const singleMessage=(req,res)=>{
    const id=req.params.id;
    messages.findById(id)
            .then((message)=>{
                res.send({message:message})
            })
}
export const deleteMessage=(req,res)=>{
    const id = req.params.id;
    messages.findByIdAndDelete(id)
        .then((result) =>
            res.send({message:"Message has deleted!"})
        )
        .catch((err) => res.status(404).json({ error: err, message: "Message is not found" }));
}