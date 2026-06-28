const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// POST /api/contact — contact form (saves as lead with source=contact-form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    const lead = new Lead({ name, email, phone, service, message, source: 'contact-form' });
    await lead.save();
    res.status(201).json({ success: true, message: 'Message received! We will contact you within 24 hours.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

module.exports = router;
