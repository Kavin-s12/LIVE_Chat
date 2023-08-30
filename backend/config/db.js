const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
    });
    console.log(`DB connected :${conn.connection.host}`);
  } catch (e) {
    console.log(`Error : ${e.message}`);
    process.exit();
  }
};

module.exports = connectDB;
