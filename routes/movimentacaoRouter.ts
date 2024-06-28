import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { tokenValid } from "../jwtToken";

const movimentacaoRouter = Router();
const prisma = new PrismaClient();

movimentacaoRouter.get("/", async (req, res) => {
    /*
    #swagger.tags = ['Movimentações']
    #swagger.description = 'Endpoint para retornar todas as movimentações'
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Movimentações encontradas com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    */
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }
    if (!tokenValid(token)) {
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    const movimentacoes = await prisma.movimentacao.findMany({
        include: {
            user: true,
            livro: true
        }
    });
    return res.status(200).json(movimentacoes);
});

movimentacaoRouter.get("/:id", async (req, res) => {
    /*
    #swagger.tags = ['Movimentações']
    #swagger.description = 'Endpoint para buscar movimentação por id'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'Id da movimentação' 
    }
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Movimentação encontrada com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    #swagger.responses[404] = {
        description: 'Movimentação não encontrada'
    }
    */
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }
    if (!tokenValid(token)) {
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    const { id } = req.params;

    const movimentacao = await prisma.movimentacao.findUnique({
        where : {
            id: Number(id)
        },
        include: {
            user: true,
            livro: true
        }
    });

    if (!movimentacao)
        return res.status(404).json({ error: "Movimentação não encontrada" });

    return res.status(200).json(movimentacao);

});

movimentacaoRouter.post("/", async (req, res) => {
    /*
    #swagger.tags = ['Movimentações']
    #swagger.description = 'Endpoint para criar uma nova movimentação'
    #swagger.parameters['movimentacao'] = {
        in: 'body',
        description: 'Informações da movimentação',
        required: true,
        schema: {
            dataRetirada: '2024-06-10T03:00:00.000Z',
            dataDevolucao: '2024-06-20T03:00:00.000Z',
            livroId: 1,
            userId: 1
        }
    }
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[201] = {
        description: 'Movimentação criada com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    */
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }
    if (!tokenValid(token)) {
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    const { dataRetirada, dataDevolucao, livroId, userId } = req.body;

    const movimentacao = await prisma.movimentacao.create({
        data: {
            dataRetirada,
            dataDevolucao,
            livroId: Number(livroId),
            userId: Number(userId)
        }
    });
    return res.status(201).json(movimentacao);
});

movimentacaoRouter.put("/:id", async (req, res) => {
    /*
    #swagger.tags = ['Movimentações']
    #swagger.description = 'Endpoint para atualizar uma movimentação'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'Id da movimentação' 
    }
    #swagger.parameters['movimentacao'] = {
        in: 'body',
        description: 'Informações da movimentação',
        required: true,
        schema: {
            dataRetirada: '2024-06-10T03:00:00.000Z',
            dataDevolucao: '2024-06-20T03:00:00.000Z',
            livroId: 1,
            userId: 1
        }
    }
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Movimentação atualizada com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    #swagger.responses[404] = {
        description: 'Movimentação não encontrada'
    }
    */
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }
    if (!tokenValid(token)) {
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }

    const { id } = req.params;
    const { dataRetirada, dataDevolucao, livroId, userId } = req.body;

    const movimentacaoExiste = await prisma.movimentacao.findUnique({
        where : {
            id: Number(id)
        }
    });

    if(!movimentacaoExiste){
        return res.status(404).json({ error: "Movimentação não encontrada" });
    }

    const movimentacao = await prisma.movimentacao.update({
        where: {
            id: Number(id)
        },
        data: {
            dataRetirada,
            dataDevolucao,
            livroId: Number(livroId),
            userId: Number(userId)
        }
    });

    return res.status(200).json(movimentacao);
});

movimentacaoRouter.delete("/:id", async (req, res) => {
    /*
    #swagger.tags = ['Movimentações']
    #swagger.description = 'Endpoint para deletar uma movimentação'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'Id da movimentação' 
    }
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Movimentação deletada com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    #swagger.responses[404] = {
        description: 'Movimentação não encontrada'
    }
    */
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }
    if (!tokenValid(token)) {
        return res.status(401).json({ error: "Token não informado ou inválido" });
    }
    
    const { id } = req.params;

    const movimentacaoExiste = await prisma.movimentacao.findUnique({
        where: {
            id: Number(id)
        }
    });

    if (!movimentacaoExiste)
        return res.status(404).json({ error: "Movimentação não encontrada" });

    await prisma.movimentacao.delete({
        where: {
            id: Number(id)
        }
    });

    return res.status(200).json("Movimentação deletada com sucesso");
});

export default movimentacaoRouter;





