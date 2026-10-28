const Project = require('../models/Project');

exports.create = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, owner: req.user._id });
    res.status(201).json(project);
  } catch (e) { next(e); }
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { $or: [{ owner: req.user._id }, { members: req.user._id }] };
    res.json(await Project.find(filter).populate('owner', 'name email').populate('members', 'name email'));
  } catch (e) { next(e); }
};

exports.getOne = async (req, res, next) => {
  try {
    const p = await Project.findById(req.params.id).populate('owner members', 'name email');
    if (!p) { res.status(404); throw new Error('Project not found'); }
    res.json(p);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) { res.status(404); throw new Error('Project not found'); }
    if (req.user.role !== 'admin' && !p.owner.equals(req.user._id)) { res.status(403); throw new Error('Not allowed'); }
    Object.assign(p, req.body);
    res.json(await p.save());
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const p = await Project.findByIdAndDelete(req.params.id);
    if (!p) { res.status(404); throw new Error('Project not found'); }
    res.json({ message: 'Project deleted' });
  } catch (e) { next(e); }
};