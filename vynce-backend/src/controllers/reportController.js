// src/controllers/reportController.js
const Report = require('../models/Report');
const User = require('../models/User');

// POST /api/reports  -> create a report
exports.createReport = async (req, res) => {
  try {
    const { type, reason, message, reportedUsername, meta, severity } = req.body;

    if (!type || !reason) return res.status(400).json({ message: 'Missing required fields' });

    // If type === 'user' and reportedUsername provided, attempt to resolve user id
    let reportedUser = null;
    if (type === 'user' && reportedUsername) {
      const target = await User.findOne({ username: reportedUsername });
      if (target) reportedUser = target._id;
    }

    const reporter = req.userId || null;
    const reporterName = req.body.reporterName || (req.userId ? undefined : 'Anonymous');

    const device = req.headers['user-agent'] || '';

    const report = await Report.create({
      reporter,
      reporterName: reporterName === undefined ? '' : reporterName,
      reportedUser,
      reportedUsername: reportedUsername || '',
      type,
      reason,
      message: message || '',
      meta: meta || {},
      device,
      severity: severity || 'low'
    });

    // Minimal response
    res.status(201).json({ message: 'Report submitted', reportId: report._id });
  } catch (err) {
    console.error('createReport error', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/my -> list reports created by logged-in user
exports.getMyReports = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });

    const reports = await Report.find({ reporter: req.userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports (admin-only in future) -> list all. For now require a simple env flag check or role.
exports.getAllReports = async (req, res) => {
  try {
    // Simple guard: allow only if user has admin flag (extend User model later)
    const user = req.userId ? await User.findById(req.userId) : null;
    if (!user || !user.isAdmin) return res.status(403).json({ message: 'Forbidden' });

    const reports = await Report.find().sort({ createdAt: -1 }).limit(500);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/reports/:id/status  -> update status (admin/moderator)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    // Check admin
    const user = req.userId ? await User.findById(req.userId) : null;
    if (!user || !user.isAdmin) return res.status(403).json({ message: 'Forbidden' });

    const r = await Report.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: 'Updated', report: r });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
