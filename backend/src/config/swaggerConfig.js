import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_URL = "https://dealplay-backend.vercel.app";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DealPlay API",
      version: "1.0.0",
      description: "Documentação da API do DealPlay — sistema de catálogo de jogos e comparação de preços.",
    },
    servers: [
      {
        url: SERVER_URL,
        description: "Servidor atual",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Rotas de autenticação e login de usuários.",
      },
      {
        name: "Users",
        description: "CRUD de usuários.",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["username", "email", "name", "password"],
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Joyce Campelo" },
            username: { type: "string", example: "joycecampelos" },
            email: { type: "string", example: "joyce@example.com" },
            password: { type: "string", example: "SenhaSegura@123" },
            role: { type: "string", enum: ["admin", "user"], example: "admin" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "joyce@example.com" },
            password: { type: "string", example: "SenhaSegura@123" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, "../routes/*.js")],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiServe = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup;
