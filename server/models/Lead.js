const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  service: { type: String, trim: true },
  message: { type: String, trim: true },
  company: { type: String, trim: true },
  budget: { type: String, trim: true },
  timeline: { type: String, trim: true },
  address: { type: String, trim: true },
  howHeard: { type: String, trim: true },
  preferredContact: { type: String, trim: true },
  source: { type: String, default: 'landing-page' },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'converted', 'lost'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lead', leadSchema);
