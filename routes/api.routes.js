const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/User");

/* LOGIN */
router.post("/login", async (req, res) => {
  const user = await User.findOne({ phone: req.body.phone });
  if (!user) return res.status(401).json({ error: "User not found" });
  res.json({ userId: user._id, pinRequired: true });
});

/* UNLOCK */
router.post("/unlock", async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (!user || user.pin !== req.body.pin) {
    return res.status(401).json({ error: "Wrong PIN" });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || "devsecret",
    { expiresIn: "1h" }
  );

  res.json({ token });
});

/* BALANCE */
router.get("/balance", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.json({ balance: user.balance });
});

/* PAY */
router.post("/pay", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (user.balance < req.body.amount) {
    return res.status(400).json({ error: "No funds" });
  }
  user.balance -= req.body.amount;
  await user.save();
  res.json({ success: true, newBalance: user.balance });
});

/* ===== ADMIN ONLY ===== */
router.use("/admin", auth, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
});

/* LIST USERS */
router.get("/admin/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

/* CREATE USER */
router.post("/admin/users", async (req, res) => {
  const user = await User.create({
    phone: req.body.phone,
    pin: req.body.pin || "0000",
    balance: req.body.balance || 0,
    role: req.body.role || "user"
  });
  res.json(user);
});

/* RESET PIN */
router.post("/admin/users/:id/reset-pin", async (req, res) => {
  const user = await User.findById(req.params.id);
  user.pin = "0000";
  await user.save();
  res.json({ success: true });
});

/* UPDATE BALANCE */
router.post("/admin/users/:id/balance", async (req, res) => {
  const user = await User.findById(req.params.id);
  user.balance = req.body.balance;
  await user.save();
  res.json({ success: true });
});

/* DELETE USER */
router.delete("/admin/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;

