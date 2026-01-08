const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("AGROV backend is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/login", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone required" });
  }

  return res.json({
    userId: 1,
    pinRequired: true
  });
});

app.post("/unlock", (req, res) => {
  const { pin } = req.body;

  if (pin !== "1234") {
    return res.status(401).json({ error: "Wrong PIN" });
  }

  return res.json({
    success: true,
    token: "demo-token-123"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
