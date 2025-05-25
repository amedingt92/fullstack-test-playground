const express = require("express");
const path = require("path");
const app = express();
const helloRoutes = require("./routes");
const userRoutes = require("./routes/users");
const setupSwagger = require("./swagger");

app.use(express.json());
app.use("/api", helloRoutes);
app.use("/api/users", userRoutes);
setupSwagger(app);

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));  // Remove the ../

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));  // Remove the ../
});

module.exports = app;
