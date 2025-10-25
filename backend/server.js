import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import { swaggerSpec, swaggerUiSetup } from "./src/configs/swaggerConfig.js";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // para ler JSON no body

// Rotas
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Rota de documentação Swagger
app.use("/api-docs", swaggerUiSetup.serve, swaggerUiSetup.setup(swaggerSpec));

// rota raiz só para checagem
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Bem vindo(a) ao backend do DealPlay!" });
});

// porta padrão (Vercel define automaticamente em production)
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
