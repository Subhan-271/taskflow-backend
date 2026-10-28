module.exports = (err, req, res, next) => {
  const status = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(status).json({ success: false, message: err.message });
};