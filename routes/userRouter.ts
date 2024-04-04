import { PrismaClient } from "@prisma/client";
import { Router } from "express";


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
    const {senha, email} = req.body;

    const user = await prisma.user.create({
        data: {
            senha, 
            email
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

export default userRouter;