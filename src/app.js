const express = require("express");
const app = express();
const helloRoutes = require("./routes");
const userRoutes = require("./routes/users");
const setupSwagger = require("./swagger");

app.use(express.json());
app.use("/api", helloRoutes);
app.use("/api/users", userRoutes);
setupSwagger(app);

app.get("/", (req, res) => {
    res.redirect("/api-docs");
});


module.exports = app;
