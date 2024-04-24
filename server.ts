import express from "express";
import cors from "cors";
import livroRouter from "./routes/livroRouter";
import userRouter from "./routes/userRouter";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swaggerDoc.json";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/livros", livroRouter);
app.use("/usuarios", userRouter)
app.use("/docs", swaggerUi.serve);

app.get('/docs', swaggerUi.setup(swaggerDoc));

app.listen(3000, () => {
    console.log("Server rodando na porta 3000");
});

