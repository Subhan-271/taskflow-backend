require('dotenv').config();
const app = require('./app');
const connectDB = require('../config/db');

connectDB().then(() => {
  app.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
});