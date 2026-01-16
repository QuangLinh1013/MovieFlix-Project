
const app = require('./src/app');
require('dotenv').config();

const port = process.env.PORT || 8888;
const host = process.env.HOST_NAME || 'localhost';

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});