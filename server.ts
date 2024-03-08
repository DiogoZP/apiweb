import express from "express";
import autorRouter from "./routes/autorRouter";
import livroRouter from "./routes/livroRouter";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swaggerDoc.json";

const app = express();

app.use(express.json());
app.use("/autores", autorRouter);
app.use("/livros", livroRouter);
app.use("/docs", swaggerUi.serve);

app.get('/docs', swaggerUi.setup(swaggerDoc));

app.listen(3000, () => {
    console.log("Server rodando na porta 3000");
});

