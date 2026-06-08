require('dotenv').config();
const pool = require('./config/db');
const hashPassword = require('./utils/hashPassword');

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS experts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      expertise VARCHAR(200),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS expert_scans (
      id SERIAL PRIMARY KEY,
      expert_id INTEGER REFERENCES experts(id) ON DELETE CASCADE,
      expert_name VARCHAR(100),
      label VARCHAR(100),
      confidence FLOAT,
      scores JSONB,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log('✅ Tables created (if not existed)');
};

const seedExpert = async () => {
  const hashed = await hashPassword('expert123');
  const existing = await pool.query('SELECT id FROM experts WHERE email = $1', ['expert@maizeai.com']);
  if (existing.rows.length === 0) {
    await pool.query(
      `INSERT INTO experts (name, email, password_hash, expertise)
       VALUES ($1, $2, $3, $4)`,
      ['Dr. John Mwangi', 'expert@maizeai.com', hashed, 'Maize Pathologist']
    );
    console.log('✅ Default expert inserted: expert@maizeai.com / expert123');
  } else {
    console.log('ℹ️ Expert already exists, skipping seed');
  }
};

const run = async () => {
  await createTables();
  await seedExpert();
  process.exit(0);
};

run().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});