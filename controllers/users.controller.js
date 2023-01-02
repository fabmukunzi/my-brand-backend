import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

const compare = bcrypt.compare;
const sign = jwt.sign;

export const user_signup = async (req, res, next) => {
    res.send({message:"Signup successful"});
};

export const user_login = async (req, res, next) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({error: "User not found"});
        }
        if (await compare(req.body.password, user.password)) {
            const userData = { id: user._id, email: user.email };
            const token = sign(userData, "TOP_SECRET");
            res.json({token:token,message:"Successfully loggedin"});
        }
        else return res.status(400).json({error: "Wrong credentials"});
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};
