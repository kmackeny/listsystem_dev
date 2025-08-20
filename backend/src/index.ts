import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// List API
app.get('/api/companies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM companies ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/api/companies', async (req, res) => {
  const { name, area, phone_number, website_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO companies (name, area, phone_number, website_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, area, phone_number, website_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Call History API
app.get('/api/companies/:companyId/history', async (req, res) => {
  const { companyId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM call_history WHERE company_id = $1 ORDER BY created_at DESC', [companyId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/api/companies/:companyId/history', async (req, res) => {
  const { companyId } = req.params;
  const { person_in_charge, result: call_result, memo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO call_history (company_id, person_in_charge, result, memo) VALUES ($1, $2, $3, $4) RETURNING *',
      [companyId, person_in_charge, call_result, memo]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
