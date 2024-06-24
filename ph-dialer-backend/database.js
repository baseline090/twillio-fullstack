const mongoose = require("mongoose");
const connectDB = () => {
  // console.log("dbbb")
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`mongo db connected to ${data.connection.host}`);
    });
};
module.exports = connectDB;
