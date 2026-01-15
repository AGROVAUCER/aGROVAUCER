
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const apiRoutes = require("./routes/api.routes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AGROV SERVER RUNNING");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", apiRoutes);
app.use("/admin", express.static("public"));

module.exports = app;
