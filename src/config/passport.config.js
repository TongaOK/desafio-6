import passport from "passport";
import {Strategy as LocalStrategy } from "passport-local";
import { createHash, isValidPassword } from "../utilities.js";
import UserModel from "../models/user.model.js";

const opts = {
    usernameField: "email",
    passReqToCallback: true
}

export const init = () => {
    passport.use("register", new LocalStrategy(opts, async (req, email, password, done) => {
        try {
            const user = await UserModel.findOne({ email })
            if (user) {
                return done(new error ('user aleready registered'))
            }
            const newUser = await UserModel.create({
                ...req.body,
                password: createHash(password)
            })
            done(null, newUser)
        } catch (error) {
            done (new Error (`Ocurrio un error durante la autentacion ${error.message}.`))
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (uid, done) => {
        const user = await UserModel.findById(uid);
        done(null, user);
    })
}