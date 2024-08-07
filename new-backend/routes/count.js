// In routes/count.js or wherever you define your routes
const express = require('express');
const router = express.Router();
const Count = require('../models/count');

router.get('/counts', async (req, res) => {
    console.log(req.query, "incopunt")
  const id = req.query.id; // Assuming you have a fixed ID
  const users = await Count.findOne({ id });
    console.log('user: ', users);
  try {
    const user = await Count.findOne({ id });
    console.log('user: ', user);
    if (!user) {
      console.log("user not found")
      return res.status(404).json({ msg: 'User not found' });
    }
    console.log(user)
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
