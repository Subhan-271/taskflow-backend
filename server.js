const fs = require('node:fs');
const path = require('node:path');
const rootEnvPath = path.join(__dirname, '.env');
const fallbackEnvPath = path.join(__dirname, 'tests', '.env');
const envPath = fs.existsSync(rootEnvPath) ? rootEnvPath : fallbackEnvPath;

if (envPath === fallbackEnvPath) {
  console.warn('Root .env not found; loading tests/.env as a fallback.');
}
require('dotenv').config({ path: envPath });
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 3000;

const startServer = async () => {
  const maxAttempts = 10;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await connectDB();
      app.listen(port, () => console.log(`Server on port ${port}`));
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error(`Server startup failed after ${maxAttempts} database connection attempts: ${error.message.split('\n')[0]}`);
        process.exitCode = 1;
        return;
      }

      console.warn(`Database connection attempt ${attempt}/${maxAttempts} failed; retrying: ${error.message.split('\n')[0]}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

startServer();
