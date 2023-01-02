import Joi from "joi";

const usersSchema = Joi.object({
    email: Joi.string().regex(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/).required(),
    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{6,}$/).required(),
});

const usersValidation = async (req, res, next) => {
    const value = usersSchema.validate(req.body, { abortEarly: false });
    if (value.error) {
        return res.status(400).json({error: value.error.details});
    } else {
        next();
    }
};

export default usersValidation;
