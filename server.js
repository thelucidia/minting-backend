const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3002;

const userRoutes = require("./routes/userRoutes");

connectDB();

app.use(bodyParser.json());

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
