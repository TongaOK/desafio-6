import passport from "passport";
import {Strategy as LocalStrategy } from "passport-local";
import { createHash, isValidPassword } from "../utilities.js";
import UserModel from "../models/user.model.js";
import GitHubStrategy from "passport-github2";

const opts = {
    usernameField: "email",
    passReqToCallback: true
}

const githubOpts = {
    clientID: 'Iv1.349a60bc7f380c2f',
    clientSecret: 'de39670a9a91d37d47a7dbf42ebd7f791f8a4de5',
    callbackURL: "http://localhost:8080/api/sessions/github/callback",
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

    passport.use("login", new LocalStrategy(opts, async (req, email, password, done) => {
        try {
            const user = await UserModel.findOne({ email })
            if (!user) {
                return done(new Error('Correo o contraseña invalidos'))
            }
            const isPassValid = isValidPassword(password, user);
            if (!isPassValid) {
                return done(new Error('Correo o contraseña invalidos'))
            }
            done(null, user)
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

export const githubStrategyInit = () => {
    passport.use('github', new GitHubStrategy(githubOpts, async (accessToken, refreshToken, profile, done) => {
        console.log('profile', profile);
        let email = profile._json.email;
        let user = await UserModel.findOne({ email });
        if (user) {
          return done(null, user);
        }
        user = {
          first_name: profile._json.name,
          last_name: '',
          email,
          age: 18,
          password: '',
          provider: 'Github',
        };
    
        const newUser = await UserModel.create(user);
        done(null, newUser);
      }));

}