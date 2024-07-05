const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomSchema = new Schema({
  // firstName: {
  //   type: String,
  //   required: true,
  // },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    default: 0,
  },
  message: {
    type: String,
    default: '',
  },
}, { strict: false });

module.exports = mongoose.model("CustomData", CustomSchema);
