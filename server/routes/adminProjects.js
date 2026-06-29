const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const PROJECTS_DIR = path.join(__dirname, '../../client/projects');
const ADMIN_KEY = process.env.ADMIN_KEY || 'centuries2024';

// Auth middleware
function adminAuth(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// Dynamic storage: saves to client/projects/<projectName>/
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = path.join(PROJECTS_DIR, req.body.name || 'Unnamed');
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename(req, file, cb) {
    // Keep original filename, prepend timestamp to avoid collisions
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${Date.now()}_${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB per file
  fileFilter(req, file, cb) {
    const ok = /\.(jpg|jpeg|png|webp|mp4|mov|webm)$/i.test(file.originalname);
    cb(ok ? null : new Error('Invalid file type'), ok);
  },
});

// POST /api/admin/projects — create project folder + upload images
router.post('/', adminAuth, (req, res) => {
  upload.array('images', 200)(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    const { name, category } = req.body;
    if (!name) return res.status(400).json({ error: 'Project name is required' });

    // Write category metadata file so the API can read it without hardcoding
    const metaPath = path.join(PROJECTS_DIR, name, '.meta.json');
    fs.writeFileSync(metaPath, JSON.stringify({ category: category || 'Other' }), 'utf8');

    res.json({
      success: true,
      project: name,
      files: (req.files || []).length,
    });
  });
});

// POST /api/admin/projects/:name/images — add more images to existing project
router.post('/:name/images', adminAuth, (req, res) => {
  req.body.name = req.params.name;
  upload.array('images', 200)(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, files: (req.files || []).length });
  });
});

// DELETE /api/admin/projects/:name — delete entire project folder
router.delete('/:name', adminAuth, (req, res) => {
  const folder = path.join(PROJECTS_DIR, req.params.name);
  if (!fs.existsSync(folder)) return res.status(404).json({ error: 'Project not found' });
  fs.rmSync(folder, { recursive: true, force: true });
  res.json({ success: true });
});

// DELETE /api/admin/projects/:name/images/:filename — delete single image
router.delete('/:name/images/:filename', adminAuth, (req, res) => {
  const file = path.join(PROJECTS_DIR, req.params.name, req.params.filename);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'File not found' });
  fs.unlinkSync(file);
  res.json({ success: true });
});

module.exports = router;
