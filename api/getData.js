import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  try {
    const { query } = req.body;
    const result = await pool.query(query);
    if (result.command === 'SELECT') {
      if (result.rows.length > 0) {
        return res.status(200).json({ success: true, data: result.rows });
      }
      else {
        return res.status(200).json({ success: false });
      }
    }
    else {
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
