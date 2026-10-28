const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) { res.status(400); throw new Error('Email already exists'); }
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: sign(user._id), user: { id: user._id, name, email, role: user.role } });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      res.status(401); throw new Error('Invalid credentials');
    }
    res.json({ token: sign(user._id), user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (e) { next(e); }
};

exports.me = (req, res) => res.json(req.user);