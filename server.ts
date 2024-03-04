import express from "express";
import autorRouter from "./routes/autorRouter";
import livroRouter from "./routes/livroRouter";

const app = express();

app.use(express.json());
app.use("/autores", autorRouter);
app.use("/livros", livroRouter);

app.listen(3000, () => {
    console.log("Server rodando na porta 3000");
});

