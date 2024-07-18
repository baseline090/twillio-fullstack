const mongoose = require("mongoose");

const bulkEmailSchema = new mongoose.Schema({
  // Define fields for your message template
  name: String,
  email: String,
  address: String,
  zipcode: String,
  city: String,
  phone: String,
  reference: String,
   createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  status: {
    type: String,
    default:1
  },
  
});
module.exports = mongoose.model("BulkEmail", bulkEmailSchema);
