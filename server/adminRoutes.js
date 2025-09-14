const express = require('express');
const Admin = require('./admin');
const router = express.Router();

// Admin Login
router.post('/login/admin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Invalid admin credentials" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid admin credentials" });

    res.json({ message: "Admin login successful", user: { username: admin.username, role: 'admin' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
