import express from "express";
import cors from "cors";
import livroRouter from "./routes/livroRouter";
import userRouter from "./routes/userRouter";
import movimentacaoRouter from "./routes/movimentacaoRouter";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swaggerDoc.json";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/livros", livroRouter);
app.use("/usuarios", userRouter);
app.use("/movimentos", movimentacaoRouter);
app.use("/docs", swaggerUi.serve);
app.get('/docs', 
    // #swagger.ignore = true
    swaggerUi.setup(swaggerDoc));

app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
});

