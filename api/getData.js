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
      return res.status(200).json({ data: result.rows });
    }
    else {
      return res.status(200).json({ rowCount: result.rowCount });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
