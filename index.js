const express = require("express");
const cors = require("cors");
const app = express();
const data = require("./data");

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

/* ===== BASIC ===== */
app.get("/", (req, res) => res.send("AGROV SERVER RUNNING"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

/* ===== LOGIN ===== */
app.post("/login", (req, res) => {
  const user = data.users.find(u => u.phone === req.body.phone);
  if (!user) return res.status(401).json({ error: "User not found" });
  res.json({ userId: user.id, pinRequired: true });
});

/* ===== PIN ===== */
app.post("/unlock", (req, res) => {
  const user = data.users.find(u => u.id === 1);
  if (user.pin !== req.body.pin)
    return res.status(401).json({ error: "Wrong PIN" });

  res.json({ token: "demo-token", userId: user.id });
});

/* ===== BALANCE ===== */
app.get("/balance/:userId", (req, res) => {
  const user = data.users.find(u => u.id == req.params.userId);
  res.json({ balance: user.balance });
});

/* ===== PAY WITH VOUCHER ===== */
app.post("/pay", (req, res) => {
  const { userId, amount, firmId } = req.body;
  const user = data.users.find(u => u.id == userId);

  if (user.balance < amount)
    return res.status(400).json({ error: "No funds" });

  user.balance -= amount;
  data.transactions.push({
    userId,
    firmId,
    amount,
    date: new Date()
  });

  res.json({ success: true, newBalance: user.balance });
});

/* ===== ADMIN ===== */
app.get("/admin/data", (req, res) => {
  res.json(data);
});

/* ===== ADMIN RESET PIN ===== */
app.post("/admin/reset-pin", (req, res) => {
  const user = data.users.find(u => u.id == req.body.userId);
  user.pin = "0000";
  res.json({ success: true, newPin: "0000" });
});

/* ===== STATIC ADMIN WEB ===== */
app.use("/admin", express.static("admin.html"));

app.listen(PORT, () =>
  console.log("AGROV server running on " + PORT)
);
