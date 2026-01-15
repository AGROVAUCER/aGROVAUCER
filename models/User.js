const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phone: String,
  pin: String,
  balance: Number,
  role: { type: String, default: "user" }
});

module.exports = mongoose.model("User", UserSchema);
