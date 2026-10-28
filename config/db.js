const mongoose = require('mongoose');
module.exports = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGO_URI or MONGODB_URI is not set. Add it to the project root .env file.');
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};