import Database from 'better-sqlite3'

export type LibraryDb = Database.Database

export function openDb(dbPath: string): LibraryDb {
  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      sha256 TEXT NOT NULL UNIQUE,
      original_filename TEXT NOT NULL,
      stored_path TEXT NOT NULL,
      mime TEXT,
      size INTEGER NOT NULL,
      width INTEGER,
      height INTEGER,
      duration_ms INTEGER,
      imported_at INTEGER NOT NULL,
      title TEXT,
      note TEXT,
      rating INTEGER NOT NULL DEFAULT 0,
      source_url TEXT,
      thumb_path TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_media_imported_at ON media(imported_at DESC);
    CREATE INDEX IF NOT EXISTS idx_media_title ON media(title);

    CREATE TABLE IF NOT EXISTS media_sources (
      media_id TEXT NOT NULL,
      source_path TEXT NOT NULL,
      imported_at INTEGER NOT NULL,
      PRIMARY KEY (media_id, source_path),
      FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_media_sources_media_id ON media_sources(media_id);

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media_tags (
      media_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'manual',
      confidence REAL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (media_id, tag_id),
      FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_media_tags_media_id ON media_tags(media_id);
    CREATE INDEX IF NOT EXISTS idx_media_tags_tag_id ON media_tags(tag_id);

    CREATE VIRTUAL TABLE IF NOT EXISTS media_fts USING fts5(
      media_id UNINDEXED,
      title,
      note
    );

    CREATE TRIGGER IF NOT EXISTS trg_media_ai AFTER INSERT ON media BEGIN
      INSERT INTO media_fts(media_id, title, note) VALUES (new.id, COALESCE(new.title, ''), COALESCE(new.note, ''));
    END;
    CREATE TRIGGER IF NOT EXISTS trg_media_au AFTER UPDATE OF title, note ON media BEGIN
      UPDATE media_fts SET title = COALESCE(new.title, ''), note = COALESCE(new.note, '') WHERE media_id = new.id;
    END;
    CREATE TRIGGER IF NOT EXISTS trg_media_ad AFTER DELETE ON media BEGIN
      DELETE FROM media_fts WHERE media_id = old.id;
    END;

    CREATE TABLE IF NOT EXISTS smart_folders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      rule_json TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `)

  db.exec(`
    INSERT INTO media_fts(media_id, title, note)
    SELECT id, COALESCE(title, ''), COALESCE(note, '')
    FROM media
    WHERE id NOT IN (SELECT media_id FROM media_fts);
  `)
  return db
}
