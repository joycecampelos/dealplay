import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import gameRoutes from "./src/routes/gameRoutes.js";
import listRoutes from "./src/routes/listRoutes.js";
import itadRoutes from "./src/routes/itadRoutes.js";
import { swaggerSpec, swaggerUiServe, swaggerUiSetup } from "./src/config/swaggerConfig.js";
import { requestLogger, errorLogger, registerProcessHandlers } from "./src/middlewares/loggingMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/games", gameRoutes);
app.use("/lists", listRoutes);
app.use("/itad", itadRoutes);

app.use("/docs", swaggerUiServe, swaggerUiSetup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ sucess: true, message: "API DealPlay funcionando!" });
});

app.use(errorLogger);
registerProcessHandlers();

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log(`Servidor ativo - http://localhost:3000`);
  });
}

export default app;
