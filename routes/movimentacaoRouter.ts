import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { tokenValid } from "../jwtToken";

const movimentacaoRouter = Router();
const prisma = new PrismaClient();

movimentacaoRouter.get("/", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Token não informado" });
    }
    if (!tokenValid(token)) {
        return res.status(401).json({ error: "Token inválido" });
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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Token não informado" });
    }
    if (!tokenValid(token)) {
        return res.status(401).json({ error: "Token inválido" });
    }

    const id = req.params.id;

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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Token não informado" });
    }
    if (!tokenValid(token)) {
        return res.status(401).json({ error: "Token inválido" });
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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Token não informado" });
    }
    if (!tokenValid(token)) {
        return res.status(401).json({ error: "Token inválido" });
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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Token não informado" });
    }
    if (!tokenValid(token)) {
        return res.status(401).json({ error: "Token inválido" });
    }
    
    const id = req.params.id;

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

    return res.status(204).json("Movimentação deletada");
});

export default movimentacaoRouter;





