import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString:
    'postgresql://postgres.wikgmfjfcbtvztokinz:H105NwdcBo35xUC4@aws-1-eu-north-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false },
});
