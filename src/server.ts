import 'dotenv/config';
import express from 'express';

const PORT = process.env.PORT || 5000;

// Express Initialize
const app = express();

app.listen(PORT, () => {
  console.log(`Server are running at: ${PORT}`);
});
