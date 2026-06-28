const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// POST /api/leads — create a new lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, message, source,
            company, budget, timeline, address, howHeard, preferredContact } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    const lead = new Lead({ name, email, phone, service, message, source,
      company, budget, timeline, address, howHeard, preferredContact });
    await lead.save();
    res.status(201).json({ success: true, message: 'Thank you! We will be in touch shortly.', lead });
  } catch (err) {
    console.error('Lead save error:', err.message);
    res.status(500).json({
      error: 'Server error. Please try again.',
      detail: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }
});

// GET /api/leads — list all leads (admin)
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
