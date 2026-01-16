
import express from 'express';
import { pool } from './db.js';
import apiRoutes from './routes/api.routes.js';

const app = express();

/* middleware */
app.use(express.json());

/* test baze */
pool.query('select 1')
  .then(() => console.log('✅ DB connected'))
  .catch(err => {
    console.error('❌ DB connection failed', err);
    process.exit(1);
  });

/* routes */
app.use('/api', apiRoutes);

/* health check */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* start server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

