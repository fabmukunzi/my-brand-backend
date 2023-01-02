import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import users from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const genToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.SECRET
    );
};
const singupStrategy = new localStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    async (email, password, done) => {
        try {
            const user = await users.findOne({ email });
            if (user) return done({ message: user.email + " already exists" });
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return next(err);
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) return next(err);

                    const newUser = new users({ email: email, password: hash });
                    newUser.save();

                    const token = genToken(newUser);
                    return done(null, token);
                });
            });
        } catch (error) {
            done(error);
        }
    }
);

export const authenticate = (req, res, next) => {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
        res.status(403).json({message: "Unauthorized request"});
    }
    try {
        const token = authorizationHeader.substring("Bearer ".length);
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err)
                return res
                    .status(403)
                    .json({ error: err, message: "Couldn't validate user" });

            req.user = user;
            next();
        });
    } catch (err) {
        res.status(403).json({ error: err, message: "Something went wrong" });
    }
};

export const signup = passport.use("signup", singupStrategy);
