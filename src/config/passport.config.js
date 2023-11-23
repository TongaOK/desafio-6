import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utilities.js";
import { User } from "../models/user.model.js";