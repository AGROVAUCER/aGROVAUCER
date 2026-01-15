const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/agrov");

(async () => {
  await User.deleteMany();

  await User.create({
    phone: "061000000",
    pin: "1234",
    balance: 1000,
    role: "admin"
  });

  console.log("Seed done");
  process.exit();
})();
