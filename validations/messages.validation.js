import Joi from "joi";

const messageValidationSchema=Joi.object({
    names:Joi.string().regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/).required(),
    email:Joi.string().regex(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/).required(),
    phone:Joi.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).required(),
    message:Joi.string().required()
});
const messageValidation = async (req, res, next) => {
    const value = messageValidationSchema.validate(req.body, { abortEarly: false });
    if (value.error) {
        return res.send(value.error.details);
    } else {
        next();
    }
};
export default messageValidation;