
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

/* ADMIN USERS (ADMIN ONLY) */
router.get("/admin/users", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  const users = await User.find();
  res.json(users);
});

module.exports = router;
