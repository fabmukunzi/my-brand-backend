import Joi from "joi";

const commentValidationSchema=Joi.object({
    names:Joi.string().regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/).required(),
    comment:Joi.string().required(),
});
const commentValidation=async(req,res,next)=>{
const value=commentValidationSchema.validate(req.body,{abordEarly:false});
if(value.error){
    return res.send({message:"Invalid names or comment"});
}
else next();
}
export default commentValidation;