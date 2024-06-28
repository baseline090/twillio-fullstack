const Count = require('../models/count');

// Generic function to increment the count
const incrementCount = async (req, res, type) => {
  const id = req.body.userId;
  console.log(req.body)
  try {
    let user = await Count.findOne({ id });
    if (!user) {
      user = new Count({ id, email: req.body.userEmail });
    }

    if (type === 'email') {
      user.emailCount += 1;
    } else if (type === 'sms') {
      user.smsCount += 1;
    } else if (type === 'whatsapp') {
      user.whatsappCount += 1;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.incrementEmailCount = (req, res) => incrementCount(req, res, 'email');
exports.incrementSmsCount = (req, res) => incrementCount(req, res, 'sms');
exports.incrementWhatsappCount = (req, res) => incrementCount(req, res, 'whatsapp');
