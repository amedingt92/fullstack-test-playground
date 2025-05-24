const express = require("express");
const app = express();
const helloRoutes = require("./routes");
const userRoutes = require("./routes/users");
const setupSwagger = require("./swagger");

app.use(express.json());
app.use("/api", helloRoutes);
app.use("/api/users", userRoutes);
setupSwagger(app);

module.exports = app;
