const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'attendee'
      );

      CREATE TABLE IF NOT EXISTS conferences (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        datetime TIMESTAMP NOT NULL,
        capacity INT DEFAULT 250,
        current_attendance INT DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS attendances (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        conference_id INT REFERENCES conferences(id),
        qr_code TEXT UNIQUE,
        attended BOOLEAN DEFAULT false,
        UNIQUE(user_id, conference_id)
      );

      CREATE TABLE IF NOT EXISTS surveys (
        id SERIAL PRIMARY KEY,
        attendance_id INT REFERENCES attendances(id),
        rating INT CHECK (rating >= 1 AND rating <= 5),
        feedback TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database setup completed');
  } catch (error) {
    console.error('Database setup error:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  setupDatabase,
};
