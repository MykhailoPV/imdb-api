import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from 'express-serve-static-core';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IMDB API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "authorization",
          description: "Enter your CollectAPI key",
        },
      },
    },
  },
  apis: ["./src/server.ts"],
};

const swaggerSpec = swaggerJsdoc(options as Parameters<typeof swaggerJsdoc>[0]);

function swaggerDocs(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export default swaggerDocs;
