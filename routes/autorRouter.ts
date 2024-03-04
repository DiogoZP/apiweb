import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const autorRouter = Router();

// Retornar todos os autores
autorRouter.get("/", async (req, res) => {
    const autores = await prisma.autor.findMany();
    return res.json(autores);
});

// Buscar um autor pelo id
autorRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const autor = await prisma.autor.findUnique({
        where: {
            id: Number(id)
        }
    });

    // Se o autor não existir, retorna um erro
    if (!autor)
        return res.status(404).json({ error: "Autor não encontrado" });

    // Retorna o autor se encontrado  
    return res.json(autor);
});

// Criar um novo autor
autorRouter.post("/", async (req, res) => {
    const { nome } = req.body;
    const autor = await prisma.autor.create({
        data: {
            nome
        }
    });
    // Retorna o autor criado
    return res.status(201).json(autor);
});

// Atualizar um autor
autorRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    
    // Verifica se o autor existe
    const autor = await prisma.autor.findUnique({
        where: {
            id: Number(id)
        }
    });
    // Se o autor não existir, retorna um erro
    if (!autor)
        return res.status(404).json({ error: "Autor não encontrado" });

    // Atualiza o autor
    const autorUpdated = await prisma.autor.update({
        where: {
            id: Number(id)
        },
        data: {
            nome
        }
    });
    // Retorna o autor atualizado
    return res.json(autorUpdated);
});

// Deletar um autor
autorRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    // Verifica se o autor existe
    const autor = await prisma.autor.findUnique({
        where: {
            id: Number(id)
        }
    });
    // Se o autor não existir, retorna um erro
    if (!autor)
        return res.status(404).json({ error: "Autor não encontrado" });

    // Deleta o autor
    await prisma.autor.delete({
        where: {
            id: Number(id)
        }
    });
    // Retorna o autor deletado
    return res.sendStatus(200);
});

export default autorRouter;
