require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require("path");
require('./config/modelConfig');
const mainRouter = require('./routes/mainRoute');
const logger = require('./utils/logger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/', mainRouter);

// Run locally with app.listen
if (!process.env.VERCEL) {
    const HOST = process.env.HOST || "localhost";
    const PORT = process.env.PORT || 8000;
    const serverLink = `Server Started on http://${HOST}:${PORT}`;

    app.listen(PORT, () => {
        console.log("Server is running on port:", PORT);
        logger.log("info", serverLink);
    });
}

// Always export app for Vercel
module.exports = app;
