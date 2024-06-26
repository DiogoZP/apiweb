import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { tokenValid } from "../jwtToken";

const prisma = new PrismaClient();
const livroRouter = Router();

// Retornar todos os livros
livroRouter.get("/", async (req, res) => {
    /*
    #swagger.tags = ['Livros']
    #swagger.description = 'Endpoint para retornar todos os livros'
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Livros encontrados com sucesso'
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

    const livros = await prisma.livro.findMany({});
    return res.json(livros);
});

// Buscar um livro pelo id
livroRouter.get("/:id", async (req, res) => {
    /*
    #swagger.tags = ['Livros']
    #swagger.description = 'Endpoint para buscar um livro por id'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'Id do livro' 
    }
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Livro encontrado com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    #swagger.responses[404] = {
        description: 'Livro não encontrado'
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
    const livro = await prisma.livro.findUnique({
        where: {
            id: Number(id)
        }
    });

    // Se o livro não existir, retorna um erro
    if (!livro)
        return res.status(404).json({ error: "Livro não encontrado" });

    // Retorna o livro se encontrado  
    return res.status(200).json(livro);
});

// Criar um novo livro
livroRouter.post("/", async (req, res) => {
    /*
    #swagger.tags = ['Livros']
    #swagger.description = 'Endpoint para criar um livro'
    #swagger.parameters['livro'] = {
        in: 'body',
        description: 'Informações do livro',
        required: true,
        type: 'object',
        schema: { 
            titulo: 'O Senhor dos Anéis',
            genero: 'Fantasia',
            autor: 'J. R. R. Tolkien'
        }
    }
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[201] = {
        description: 'Livro criado com sucesso'
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
    const { titulo, genero, autor} = req.body;
    const livro = await prisma.livro.create({
        data: {
            titulo,
            genero,
            autor
        }
    });
    // Retorna o livro criado
    return res.status(201).json(livro);
});

// Atualizar um livro
livroRouter.put("/:id", async (req, res) => {
    /*
    #swagger.tags = ['Livros']
    #swagger.description = 'Endpoint para atualizar um livro'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'Id do livro' 
    }
    #swagger.parameters['livro'] = {
        in: 'body',
        description: 'Informações do livro',
        required: true,
        schema: {
            titulo: 'O Senhor dos Anéis',
            genero: 'Fantasia',
            autor: 'J. R. R. Tolkien'
        }
    }
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Livro atualizado com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    #swagger.responses[404] = {
        description: 'Livro não encontrado'
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
    const { titulo, genero, autor} = req.body;
    
    // Verifica se o livro existe
    const livroExiste = await prisma.livro.findUnique({
        where: {
            id: Number(id)
        }
    });
    if (!livroExiste)
        return res.status(404).json({ error: "Livro não encontrado" });

    // Atualiza o livro
    const livroAtualizado = await prisma.livro.update({
        where: {
            id: Number(id)
        },
        data: {
            titulo,
            genero,
            autor
        }
    });

    // Retorna o livro atualizado
    return res.status(200).json(livroAtualizado);
});

// Deletar um livro
livroRouter.delete("/:id", async (req, res) => {
    /*
    #swagger.tags = ['Livros']
    #swagger.description = 'Endpoint para deletar um livro'
    #swagger.parameters['id'] = { 
        in: 'path',
        description: 'Id do livro' 
    }
    #swagger.security = [{
        "BearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Livro deletado com sucesso'
    }
    #swagger.responses[401] = {
        description: 'Token não informado ou inválido'
    }
    #swagger.responses[404] = {
        description: 'Livro não encontrado'
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
    // Verifica se o livro existe
    const livroExiste = await prisma.livro.findUnique({
        where: {
            id: Number(id)
        }
    });
    // Se o livro não existir, retorna um erro
    if (!livroExiste){
        return res.status(404).json({ error: "Livro não encontrado" });
    }

    // Deleta o livro
    await prisma.livro.delete({
        where: {
            id: Number(id)
        }
    });

    // Retorna um status 204 (No Content)
    res.status(200).json("Livro deletado com sucesso");
});

export default livroRouter;
