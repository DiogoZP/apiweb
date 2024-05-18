import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET ?? "";

function createToken(id: number){
    return jwt.sign({id}, secret, {expiresIn: "3h"});
}

function tokenValid(token: string){
    if (jwt.verify(token, secret)){
        return true;
    }
    return false;
}

export { createToken, tokenValid };