const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://saurabhsehgal047:EKmKoGaOstXEThMb@cluster0.ngdpkew.mongodb.net/', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
