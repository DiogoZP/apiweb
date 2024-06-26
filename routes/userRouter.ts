import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcrypt";
import { createToken, tokenValid } from "../jwtToken";

const userRouter = Router();
const prisma = new PrismaClient();

userRouter.post("/login", async (req, res) => {
    /*
    #swagger.tags = ['Usuários']
    #swagger.description = 'Endpoint para realizar o login de usuário'
    #swagger.parameters['login'] = {
        in: 'body',
        description: 'Informações de login',
        required: true,
        schema: { 
            email: 'teste@gmail.com',
            senha: '123456'
        }
    }
    #swagger.responses[200] = {
        description: 'Login realizado com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Credenciais incorretas'
    }
    */

    const { email, senha } = req.body;

    const userFind = await prisma.user.findUnique({
        where: {
            email : email 
        }
    });

    if(!userFind){
        return res.status(401).json("Credenciais incorretas");
    }

    const verifyPass = await bcrypt.compare(senha, userFind.senha);

    if(!verifyPass){
        return res.status(401).json("Credenciais incorretas");
    }
    
    const token = createToken(userFind.id);

    const { senha:_, ...userLogin } = userFind;

    return res.status(200).json({
        user: userLogin,
        token: token
    });
});

userRouter.get("/login", async (req, res) => {
    /*
    #swagger.tags = ['Usuários']
    #swagger.description = 'Endpoint para verificar token JWT<br/>Token deve ser informado junto do seu prefixo: Bearer &#60;token&#62;'
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Token válido'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    */

    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    if(tokenValid(token)){
        return res.status(200).json("Token válido");
    }

    return res.status(401).json({ error: "Token não informado ou inválido" });
});

userRouter.get("/", async (req, res) => {
    /*
    #swagger.tags = ['Usuários']
    #swagger.description = 'Endpoint para listar todos os usuários'
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Usuários listados com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    */
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    if(!tokenValid(token)){
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    const usuarios = await prisma.user.findMany({});
    return res.status(200).json(usuarios);
});

userRouter.get("/:id", async (req, res) => {
    /*
    #swagger.tags = ['Usuários']
    #swagger.description = 'Endpoint para buscar usuário por id'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'Id do usuário' 
    }
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Usuário encontrado com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    #swagger.responses[404] = {
        description: 'Usuário não encontrado'
    }
    */

    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    if(!tokenValid(token)){
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where : {
            id: Number(id)
        }
    });

    if (!user)
        return res.status(404).json({ error: "Usuário não encontrado" });

    return res.status(200).json(user);

});


userRouter.post("/", async (req, res) => {
    /*
    #swagger.tags = ['Usuários']
    #swagger.description = 'Endpoint para criar um usuário'
    #swagger.parameters['user'] = {
        in: 'body',
        description: 'Informações do usuário',
        required: true,
        schema: {
            nome: 'Teste',
            email: 'teste@gmail.com',
            senha: '123456'
        }
    }
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[201] = {
        description: 'Usuário criado com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    */
    
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    if(!tokenValid(token)){
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    const { nome, email, senha } = req.body;
    
    const encriptedPassword = await bcrypt.hash(senha, 1);

    const user = await prisma.user.create({
        data: {
            nome,
            email,
            senha: encriptedPassword
        }
    });

    return res.status(201).json({ id: user.id, nome: user.nome, email: user.email });
});

userRouter.put("/:id", async (req, res) => {
    /*
    #swagger.tags = ['Usuários']
    #swagger.description = 'Endpoint para atualizar um usuário'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'Id do usuário' 
    }
    #swagger.parameters['user'] = {
        in: 'body',
        description: 'Informações do usuário',
        required: true,
        schema: {
            nome: 'Teste',
            email: 'teste@gmail.com',
            senha: '123456'
        }
    }
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Usuário atualizado com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    #swagger.responses[404] = {
        description: 'Usuário não encontrado'
    }
    */
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    if(!tokenValid(token)){
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const user = await prisma.user.findUnique({
        where : {
            id: Number(id)
        }
    });

    if(!user){
        return res.status(404).send({ message: "Usuário não encontrado" });
    }

    const encriptedPassword = await bcrypt.hash(senha, 1);

    const usuarioAtualizado = await prisma.user.update({
        where: {
            id: Number(id)
        },
        data: {
            nome,
            email,
            senha: encriptedPassword
        }
    });

    return res.status(200).json({ id: usuarioAtualizado.id, nome: usuarioAtualizado.nome, email: usuarioAtualizado.email });
});

userRouter.delete("/:id", async (req, res) => {
    /*
    #swagger.tags = ['Usuários']
    #swagger.description = 'Endpoint para deletar um usuário'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'Id do usuário' 
    }
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Usuário deletado com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    #swagger.responses[404] = {
        description: 'Usuário não encontrado'
    }
    */

    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    if(!tokenValid(token)){
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    const { id } = req.params;

    const usuarioExiste = await prisma.user.findUnique({
        where: {
            id: Number(id)
        }
    });

    if(!usuarioExiste){
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await prisma.user.delete({
        where: {
            id: Number(id)
        }
    });
    
    return res.status(200).json("Usuário deletado com sucesso");
});


export default userRouter;