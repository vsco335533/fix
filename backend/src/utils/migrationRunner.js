import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.join(__dirname, '../../migrations');
const MIGRATIONS_TABLE = 'schema_migrations';

async function createMigrationsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log('✓ Migrations table ready');
  } catch (error) {
    console.error('Error creating migrations table:', error);
    throw error;
  }
}

async function getExecutedMigrations() {
  try {
    const result = await pool.query(
      `SELECT filename FROM ${MIGRATIONS_TABLE} ORDER BY id`
    );
    return result.rows.map(row => row.filename);
  } catch (error) {
    console.error('Error fetching executed migrations:', error);
    return [];
  }
}

async function executeMigration(filename, sql) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log(`  Executing migration: ${filename}`);
    await client.query(sql);

    await client.query(
      `INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES ($1)`,
      [filename]
    );

    await client.query('COMMIT');
    console.log(`  ✓ Migration completed: ${filename}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`  ✗ Migration failed: ${filename}`);
    console.error('  Error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

export async function runMigrations() {
  console.log('\n==========================================');
  console.log('Starting Database Migrations');
  console.log('==========================================\n');

  try {
    await createMigrationsTable();

    const executedMigrations = await getExecutedMigrations();

    if (!fs.existsSync(MIGRATIONS_DIR)) {
      console.log('No migrations directory found. Skipping migrations.');
      return;
    }

    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('No migration files found.');
      return;
    }

    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.includes(file)
    );

    if (pendingMigrations.length === 0) {
      console.log('✓ All migrations are up to date\n');
      return;
    }

    console.log(`Found ${pendingMigrations.length} pending migration(s)\n`);

    for (const filename of pendingMigrations) {
      const filePath = path.join(MIGRATIONS_DIR, filename);
      const sql = fs.readFileSync(filePath, 'utf8');
      await executeMigration(filename, sql);
    }

    console.log('\n==========================================');
    console.log('✓ All migrations completed successfully');
    console.log('==========================================\n');

  } catch (error) {
    console.error('\n==========================================');
    console.error('✗ Migration failed');
    console.error('==========================================\n');
    console.error('Error details:', error);
    throw error;
  }
}

runMigrations();