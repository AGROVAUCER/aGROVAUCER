import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';

const router = express.Router();

/* LOGIN */
router.post('/login', async (req, res) => {
  const { phone, pin } = req.body;

  const { rows } = await pool.query(
    'SELECT id, pin_hash, role FROM users WHERE phone = $1',
    [phone]
  );

  const user = rows[0];
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(pin, user.pin_hash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({ token });
});

export default router;


