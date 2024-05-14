const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

const userRoutes = require("./routes/userRoutes");

connectDB();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});