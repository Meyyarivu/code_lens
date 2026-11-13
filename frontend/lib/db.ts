import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Store the database next to the Next.js project root
const DB_DIR = path.resolve(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "reviews.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  // Ensure the data directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      email       TEXT UNIQUE NOT NULL,
      name        TEXT NOT NULL,
      hashed_password TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id                   TEXT PRIMARY KEY,
      user_id              TEXT REFERENCES users(id) ON DELETE CASCADE,
      filename             TEXT NOT NULL DEFAULT 'untitled.txt',
      language             TEXT NOT NULL DEFAULT 'plaintext',
      score                INTEGER NOT NULL DEFAULT 0,
      issue_count          INTEGER NOT NULL DEFAULT 0,
      summary              TEXT NOT NULL DEFAULT '',
      issues_json          TEXT NOT NULL DEFAULT '[]',
      strengths_json       TEXT NOT NULL DEFAULT '[]',
      recommendations_json TEXT NOT NULL DEFAULT '[]',
      original_code        TEXT NOT NULL DEFAULT '',
      fixed_code           TEXT NOT NULL DEFAULT '',
      created_at           TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

