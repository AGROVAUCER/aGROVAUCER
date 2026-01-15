const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/agrov");
  console.log("MongoDB connected");
};
