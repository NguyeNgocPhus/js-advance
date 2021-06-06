const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(
    "mongodb://localhost:27017/advance",
      {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
      }
    );

  console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = connectDB;