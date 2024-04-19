import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userRouter = Router();
const prisma = new PrismaClient();

userRouter.post("/login", async (req, res) => {
    const { senha, email } = req.body;

    const userFind = await prisma.user.findUnique({
        where: {
            email : email 
        }
    });

    if(!userFind){
        return res.status(400).json("Credenciais incorretas");
    }

    const verifyPass = await bcrypt.compare(senha, userFind.senha);

    if(!verifyPass){
        return res.status(400).json("Credenciais incorretas");
    }
    
    const token = jwt.sign({id: userFind.id}, process.env.JWT_PASS ?? 'teste', {
        expiresIn: '3h'
    });

    const { senha:_, ...userLogin } = userFind;

    return res.status(200).json({
        user: userLogin,
        token: token
    });
});

userRouter.get("/login", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json("Token não informado");
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_PASS ?? 'teste');
        return res.status(200).json(decoded);
    }catch(err){
        return res.status(401).json("Token inválido");
    }
});

userRouter.get("/", async (req, res) =>{
    const usuarios = await prisma.user.findMany({});
    return res.status(200).json(usuarios);
});

userRouter.get("/:id", async (req, res)=>{
    const id = req.params.id;

    const user = await prisma.user.findUnique({
        where : {
            id: Number(id)
        }
    });

    if (!user)
        return res.status(404).json({ error: "Usuário não encontrado" });

    return res.status(200).json(user);

});


userRouter.post("/", async (req, res)=>{
    const { senha, email, nome } = req.body;
    
    const encriptedPassword = await bcrypt.hash(senha, 15);

    const user = await prisma.user.create({
        data: {
            senha: encriptedPassword, 
            email,
            nome
        }
    });

    return res.status(201).json(user);
});

userRouter.delete("/:id", async (req, res) => {
    const id_delete = req.params.id;

    await prisma.user.delete({
        where: {
            id: Number(id_delete)
        }
    });
    
    return res.status(204).json("Usuário deletado");
});

userRouter.put("/:id", async (req, res)=>{
    const { id } = req.params;
    const { email, senha, nome } = req.body;

    const user = await prisma.user.findUnique({
        where : {
            id: Number(id)
        }
    });

    if(!user){
        return res.status(400).send({message: "Usuário não encontrado"});
    }

    const encriptedPassword = await bcrypt.hash(senha, 15);

    await prisma.user.update({
        where: {
            id: Number(id)
        },
        data: {
            email,
            senha: encriptedPassword,
            nome
        }
    });

    return res.status(200).json("Usuário atualizado com sucesso");
});

export default userRouter;