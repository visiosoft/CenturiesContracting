const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET /api/admin/stats — high-level KPIs
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek  = new Date(now); startOfWeek.setDate(now.getDate() - 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth    = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      total, newLeads, todayLeads, weekLeads, monthLeads,
      lastMonthLeads, converted, contacted,
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Lead.countDocuments({ createdAt: { $gte: startOfToday } }),
      Lead.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Lead.countDocuments({ createdAt: { $gte: lastMonth, $lt: endLastMonth } }),
      Lead.countDocuments({ status: 'converted' }),
      Lead.countDocuments({ status: 'contacted' }),
    ]);

    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;
    const monthGrowth = lastMonthLeads > 0
      ? (((monthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1)
      : null;

    res.json({
      total, newLeads, todayLeads, weekLeads, monthLeads,
      lastMonthLeads, converted, contacted, conversionRate, monthGrowth,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/trends?days=30 — leads per day
router.get('/trends', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - (days - 1));
    since.setHours(0, 0, 0, 0);

    const raw = await Lead.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            year:  { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day:   { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Fill in gaps so every day in range appears
    const map = {};
    raw.forEach(r => {
      const key = `${r._id.year}-${String(r._id.month).padStart(2,'0')}-${String(r._id.day).padStart(2,'0')}`;
      map[key] = r.count;
    });

    const result = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, leads: map[key] || 0 });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/by-service
router.get('/by-service', async (req, res) => {
  try {
    const data = await Lead.aggregate([
      { $group: { _id: { $ifNull: ['$service', 'Not specified'] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(data.map(d => ({ name: d._id, value: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/by-source
router.get('/by-source', async (req, res) => {
  try {
    const data = await Lead.aggregate([
      { $group: { _id: { $ifNull: ['$source', 'unknown'] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(data.map(d => ({ name: d._id, value: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/by-status
router.get('/by-status', async (req, res) => {
  try {
    const data = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(data.map(d => ({ name: d._id, value: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/leads — paginated leads table
router.get('/leads', async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 15;
    const status = req.query.status || '';
    const search = req.query.search || '';

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Lead.countDocuments(query),
    ]);

    res.json({ leads, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/leads/:id — update status
router.patch('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/leads/:id
router.delete('/leads/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
