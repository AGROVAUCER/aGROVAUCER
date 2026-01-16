const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URL);

(async () => {
  await User.deleteMany();

  await User.create({
    phone: "061000000",
    pin: "1234",
    balance: 1000,
    role: "admin"
  });

  console.log("ADMIN CREATED");
  process.exit();
})();
