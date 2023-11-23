import { fileURLToPath } from "url";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const PRIVATE_KEY = "XXXXX"
const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: "24h"});
    return token
}

const authToken = (req, res, next) => {
    const authHeader = req.headers.autorization;
    if(!authHeader) return res.status(401).send({error: "No autorizado"});
    const token = authHeader.split(" ")[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: "No autorizado" });
        req.user = credentials.user;
        next();
      });
}

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);


const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

console.log(__dirname);
