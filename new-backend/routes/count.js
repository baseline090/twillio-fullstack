// In routes/count.js or wherever you define your routes
const express = require('express');
const router = express.Router();
const Count = require('../models/count');

router.get('/counts', async (req, res) => {
    console.log(req.query, "incopunt")
  const id = req.query.id; // Assuming you have a fixed ID
  try {
    const user = await Count.findOne({ id });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
