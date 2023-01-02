import Joi from "joi";
const blogValidationSchema=Joi.object({
    title: Joi.string().regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/).required(),
    //image: Joi.string().required(),
    content: Joi.string().min(4).required(),
});

const blogValidation = async (req, res, next) => {
    const value = blogValidationSchema.validate(req.body, { abortEarly: false });
    if (value.error) {
        
        return res.send({
            message:"Invalid blog details",error:value.error
        });
    } else {
        next();
    }
};
export default blogValidation;