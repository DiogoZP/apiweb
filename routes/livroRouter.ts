import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const livroRouter = Router();

// Retornar todos os livros
livroRouter.get("/", (req, res) => {
    const livros = prisma.livro.findMany();
    return res.status(200).json(livros);
});

// Buscar um livro pelo id
livroRouter.get("/:id", (req, res) => {
    const { id } = req.params;
    const livro = prisma.livro.findUnique({
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
    const { titulo, genero ,autor} = req.body;
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
    const { id } = req.params;
    const { titulo, genero, autor} = req.body;
    
    // Verifica se o livro existe
    const livro = await prisma.livro.findUnique({
        where: {
            id: Number(id)
        }
    });
    if (!livro)
        return res.status(404).json({ error: "Livro não encontrado" });

    // Atualiza o livro
    const livroUpdated = await prisma.livro.update({
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
    return res.status(200).json(livroUpdated);
});

// Deletar um livro
livroRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    // Verifica se o livro existe
    const livro = await prisma.livro.findUnique({
        where: {
            id: Number(id)
        }
    });
    // Se o livro não existir, retorna um erro
    if (!livro)
        return res.status(404).json({ error: "Livro não encontrado" });

    // Deleta o livro
    await prisma.livro.delete({
        where: {
            id: Number(id)
        }
    });

    // Retorna um status 204 (No Content)
    res.sendStatus(204);
});

export default livroRouter;
