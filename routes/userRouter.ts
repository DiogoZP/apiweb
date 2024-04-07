import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userRouter = Router();
const prisma = new PrismaClient();

userRouter.get("/", (req, res) =>{
    const usuarios = prisma.user.findMany()
    return res.status(200).json(usuarios)
})

userRouter.get("/:id", (req, res)=>{
    const id = req.params.id;

    const user = prisma.user.findUnique({
        where : {
            id: Number(id)
        }
    })

    if (!user)
        return res.status(404).json({ error: "Usuário não encontrado" });

    return res.status(200).json(user)

})


userRouter.post("/create", async (req, res)=>{
    const {senha, email, nome} = req.body;


    const enciptedPassword = await bcrypt.hash(senha, 15)   

    const user = await prisma.user.create({
        data: {
            senha: enciptedPassword, 
            email,
            nome
        }
    })

    return res.status(201).json(user);
})

userRouter.delete("/delete/:id", async (req, res)=>{
    const id_delete = req.params.id;

    await prisma.user.delete({
        where: {
            id: Number(id_delete)
        }
    })
    
    return res.status(204).json("Usuário deletado");
})

userRouter.patch("/:id", async (req, res)=>{
    const { id } = req.params;
    const {email, senha} = req.body

    const user = prisma.user.findUnique({
        where : {
            id: Number(id)
        }
    })

    if(!user){
        return res.status(400).send({message: "Usuário não encontrado"});
    }

    await prisma.user.update({
        where: {
            id: Number(id)
        },
        data: {
            email,
            senha
        }
    })

    return res.status(200).json("Usuário atualizado com sucesso")
})


userRouter.post("/login", async (req, res)=>{
    const { senha, email } = req.body

    const userFind = await prisma.user.findUnique({
        where: {
            email : email 
        }
    })

    if(!userFind){
        res.status(400).json("Credenciais incorretas")
    } else {

        const verifyPass = await bcrypt.compare(senha, userFind.senha)

        if(!verifyPass){
            res.status(400).json("Credenciais incorretas")
        }
    
        const token = jwt.sign({id: userFind.id}, process.env.JWT_PASS ?? '', {
            expiresIn: '3h'
        })

        const {senha:_, ...userLogin} = userFind

        return res.status(200).json({
            user: userLogin,
            token: token
        })
    }



})
export default userRouter;