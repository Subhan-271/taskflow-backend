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

connectDB().then(() => {
  app.listen(port, () => console.log(`Server on port ${port}`));
}).catch((error) => {
  console.error(`Server startup failed: ${error.message}`);
  process.exitCode = 1;
});
