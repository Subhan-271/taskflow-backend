const Task = require('../models/Task');

exports.create = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = req.query.project ? { project: req.query.project } : {};
    const tasks = await Task.find(filter).populate('project').populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project')
      .populate('assignedTo', 'name email');
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    Object.assign(task, req.body);
    res.json(await task.save());
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};