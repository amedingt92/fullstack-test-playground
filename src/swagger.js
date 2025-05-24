const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Fullstack Test Playground API",
            version: "1.0.0",
            description: "Express.js + SQLite practice project with full testing stack.",
        },
    },
    apis: ["./src/routes/*.js"], // Paths to files with Swagger annotations
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
