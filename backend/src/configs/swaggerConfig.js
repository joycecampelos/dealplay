import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Configuração básica do Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DealPlay API",
      version: "1.0.0",
      description: "Documentação da API do DealPlay — Sistema de catálogo de jogos.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
      {
        url: "https://dealplay.vercel.app",
        description: "Servidor de produção (Vercel)",
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
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Caminhos dos arquivos que têm as anotações JSDoc das rotas
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiSetup = swaggerUi;
