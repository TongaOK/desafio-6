import { Router } from "express";
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utilities.js";
import passport from "passport";

const router = Router();

router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/api/sessions/login");
  }
  console.log(req.session.user);
  res.render("profile", { title: "Profile", user: req.session.user });
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/api/sessions/profile");
  }

  res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/api/sessions/profile");
  }
  res.render("register", { title: "Register" });
});

router.post("/register", passport.authenticate('register', { failureRedirect: '/register' }), 
  (req, res) => {
      res.redirect('/api/sessions/login');
  })


router.post("/login", passport.authenticate('login', { failureRedirect: '/login' }), 
  (req, res) => {
    req.session.user = req.user;
      res.redirect('/api/sessions/profile');
  })


router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/api/sessions/login");
  });
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] },async(req,res)=>{}));

router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }),async(req,res)=>{
  //if (req){req.session.user = req.user}
  req.session.user = req.user;
  res.redirect('/');
})

export default router;
