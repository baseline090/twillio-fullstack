const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountSchema = new Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
  emailCount: { type: Number, default: 0 },
  smsCount: { type: Number, default: 0 },
  whatsappCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Count', CountSchema);
