import { createHash, randomUUID } from 'crypto'
import { createReadStream } from 'fs'
import { copyFile, mkdir, readFile, stat, unlink, writeFile } from 'fs/promises'
import { lookup as lookupMime } from 'mime-types'
import path from 'path'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import { openDb, type LibraryDb } from './db'

if (typeof ffmpegPath === 'string') {
  ffmpeg.setFfmpegPath(ffmpegPath)
}

export type MediaRow = {
  id: string
  title: string | null
  originalFilename: string
  mime: string | null
  importedAt: number
  thumbUrl: string | null
  originalUrl: string
}

export type MediaDetails = MediaRow & {
  note: string | null
  rating: number
  tags: Array<{ id: string; name: string; source: string; confidence: number | null }>
  sources: string[]
}

export type TagRow = { id: string; name: string }

export type SmartFolderRow = { id: string; name: string; ruleJson: string }

type LibraryConfig = {
  version: number
  createdAt: number
}

export class LibraryManager {
  private libraryPath: string | null = null
  private db: LibraryDb | null = null

  getStatus(): { open: boolean; libraryPath: string | null } {
    return { open: this.db !== null && this.libraryPath !== null, libraryPath: this.libraryPath }
  }

  async createLibrary(libraryPath: string): Promise<void> {
    await mkdir(libraryPath, { recursive: true })
    await this.assertWritableDirectory(libraryPath)
    await mkdir(path.join(libraryPath, 'originals'), { recursive: true })
    await mkdir(path.join(libraryPath, 'thumbs'), { recursive: true })

    const configPath = path.join(libraryPath, 'library.json')
    const existing = await this.safeReadJson(configPath)
    if (!existing) {
      const config: LibraryConfig = { version: 1, createdAt: Date.now() }
      await writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8')
    }

    const dbPath = path.join(libraryPath, 'db.sqlite')
    const db = openDb(dbPath)
    db.close()
  }

  async openLibrary(libraryPath: string): Promise<void> {
    const dbPath = path.join(libraryPath, 'db.sqlite')
    await stat(dbPath)

    this.closeLibrary()
    this.libraryPath = libraryPath
    try {
      this.db = openDb(dbPath)
    } catch {
      this.closeLibrary()
      throw new Error(
        `无法打开库：${libraryPath}\n` +
          `请确认该目录可读写（SQLite WAL 需要写权限），且 db.sqlite 未被其他进程占用。`
      )
    }
  }

  closeLibrary(): void {
    if (this.db) {
      this.db.close()
    }
    this.db = null
    this.libraryPath = null
  }

  async importFiles(filePaths: string[]): Promise<{ imported: number; skipped: number }> {
    const libraryPath = this.requireLibraryPath()
    const db = this.requireDb()

    let imported = 0
    let skipped = 0

    for (const filePath of filePaths) {
      const fileStat = await stat(filePath)
      if (!fileStat.isFile()) {
        skipped += 1
        continue
      }

      const sha256 = await this.computeSha256(filePath)
      const ext = path.extname(filePath).toLowerCase()
      const storedRel = this.makeStoredRelativePath(sha256, ext)
      const storedAbs = path.join(libraryPath, storedRel)
      await mkdir(path.dirname(storedAbs), { recursive: true })

      const existing = db
        .prepare('SELECT id FROM media WHERE id = ?')
        .get(sha256) as { id: string } | undefined
      if (existing) {
        db.prepare(
          `INSERT OR IGNORE INTO media_sources(media_id, source_path, imported_at)
           VALUES (?, ?, ?)`
        ).run(sha256, filePath, Date.now())
        skipped += 1
        continue
      }

      try {
        await stat(storedAbs)
      } catch {
        await copyFile(filePath, storedAbs)
      }

      const mime = (lookupMime(ext) || null) as string | null
      const originalFilename = path.basename(filePath)
      const title = path.basename(filePath, ext)
      const importedAt = Date.now()

      const thumbRel = await this.generateThumbnailIfPossible(sha256, storedAbs, mime)

      const insert = db.transaction(() => {
        db.prepare(
          `INSERT INTO media (
            id, sha256, original_filename, stored_path, mime, size, imported_at, title, thumb_path
          ) VALUES (
            @id, @sha256, @original_filename, @stored_path, @mime, @size, @imported_at, @title, @thumb_path
          )`
        ).run({
          id: sha256,
          sha256,
          original_filename: originalFilename,
          stored_path: storedRel,
          mime,
          size: fileStat.size,
          imported_at: importedAt,
          title,
          thumb_path: thumbRel
        })

        db.prepare(
          `INSERT OR IGNORE INTO media_sources(media_id, source_path, imported_at)
           VALUES (?, ?, ?)`
        ).run(sha256, filePath, importedAt)
      })
      insert()

      imported += 1
    }

    return { imported, skipped }
  }

  listMedia(limit = 200, offset = 0): MediaRow[] {
    const db = this.requireDb()
    const rows = db
      .prepare(
        `SELECT
          id,
          title,
          original_filename as originalFilename,
          mime,
          imported_at as importedAt,
          thumb_path as thumbPath
        FROM media
        ORDER BY imported_at DESC
        LIMIT ? OFFSET ?`
      )
      .all(limit, offset) as Array<{
      id: string
      title: string | null
      originalFilename: string
      mime: string | null
      importedAt: number
      thumbPath: string | null
    }>

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      originalFilename: r.originalFilename,
      mime: r.mime,
      importedAt: r.importedAt,
      thumbUrl: r.thumbPath ? `rmthumb://thumb/${r.id}` : null,
      originalUrl: `rmorig://orig/${r.id}`
    }))
  }

  getMediaDetails(id: string): MediaDetails | null {
    const db = this.requireDb()
    const row = db
      .prepare(
        `SELECT
          id,
          title,
          original_filename as originalFilename,
          mime,
          imported_at as importedAt,
          thumb_path as thumbPath,
          note,
          rating
        FROM media
        WHERE id = ?`
      )
      .get(id) as
      | {
          id: string
          title: string | null
          originalFilename: string
          mime: string | null
          importedAt: number
          thumbPath: string | null
          note: string | null
          rating: number
        }
      | undefined
    if (!row) return null

    const tags = db
      .prepare(
        `SELECT
          t.id as id,
          t.name as name,
          mt.source as source,
          mt.confidence as confidence
        FROM media_tags mt
        JOIN tags t ON t.id = mt.tag_id
        WHERE mt.media_id = ?
        ORDER BY t.name ASC`
      )
      .all(id) as Array<{ id: string; name: string; source: string; confidence: number | null }>

    const sources = db
      .prepare(`SELECT source_path as sourcePath FROM media_sources WHERE media_id = ? ORDER BY imported_at DESC`)
      .all(id)
      .map((r) => (r as { sourcePath: string }).sourcePath)

    return {
      id: row.id,
      title: row.title,
      originalFilename: row.originalFilename,
      mime: row.mime,
      importedAt: row.importedAt,
      thumbUrl: row.thumbPath ? `rmthumb://thumb/${row.id}` : null,
      originalUrl: `rmorig://orig/${row.id}`,
      note: row.note,
      rating: row.rating,
      tags,
      sources
    }
  }

  setMediaMeta(id: string, patch: { title?: string | null; note?: string | null; rating?: number }): void {
    const db = this.requireDb()
    if (!this.isValidId(id)) throw new Error('Invalid id')
    const current = db.prepare('SELECT title, note, rating FROM media WHERE id = ?').get(id) as
      | { title: string | null; note: string | null; rating: number }
      | undefined
    if (!current) throw new Error('Not found')
    const title = patch.title !== undefined ? patch.title : current.title
    const note = patch.note !== undefined ? patch.note : current.note
    const rating = patch.rating !== undefined ? patch.rating : current.rating
    db.prepare('UPDATE media SET title = ?, note = ?, rating = ? WHERE id = ?').run(title, note, rating, id)
  }

  listTags(query?: string, limit = 50): TagRow[] {
    const db = this.requireDb()
    if (query && query.trim()) {
      return db
        .prepare('SELECT id, name FROM tags WHERE name LIKE ? ORDER BY name ASC LIMIT ?')
        .all(`%${query.trim()}%`, limit) as TagRow[]
    }
    return db.prepare('SELECT id, name FROM tags ORDER BY name ASC LIMIT ?').all(limit) as TagRow[]
  }

  updateTag(tagId: string, name: string): TagRow {
    const db = this.requireDb()
    const nextName = name.trim()
    if (!tagId) throw new Error('Invalid id')
    if (!nextName) throw new Error('Invalid name')

    const tx = db.transaction(() => {
      const current = db.prepare('SELECT id, name FROM tags WHERE id = ?').get(tagId) as TagRow | undefined
      if (!current) throw new Error('Not found')

      const existing = db.prepare('SELECT id, name FROM tags WHERE name = ?').get(nextName) as TagRow | undefined
      if (existing && existing.id !== tagId) {
        db.prepare('UPDATE OR IGNORE media_tags SET tag_id = ? WHERE tag_id = ?').run(existing.id, tagId)
        db.prepare('DELETE FROM media_tags WHERE tag_id = ?').run(tagId)
        db.prepare('DELETE FROM tags WHERE id = ?').run(tagId)
        return { id: existing.id, name: existing.name }
      }

      db.prepare('UPDATE tags SET name = ? WHERE id = ?').run(nextName, tagId)
      return { id: tagId, name: nextName }
    })

    return tx()
  }

  deleteTag(tagId: string): void {
    const db = this.requireDb()
    if (!tagId) throw new Error('Invalid id')
    db.prepare('DELETE FROM tags WHERE id = ?').run(tagId)
  }

  addTagsToMedia(
    mediaId: string,
    tagNames: string[],
    source: 'manual' | 'ai' = 'manual',
    confidence: number | null = null
  ): void {
    const db = this.requireDb()
    if (!this.isValidId(mediaId)) throw new Error('Invalid id')
    const now = Date.now()
    const tx = db.transaction(() => {
      for (const raw of tagNames) {
        const name = raw.trim()
        if (!name) continue
        const tagId = randomUUID()
        db.prepare('INSERT OR IGNORE INTO tags(id, name, created_at) VALUES (?, ?, ?)').run(tagId, name, now)
        const row = db.prepare('SELECT id FROM tags WHERE name = ?').get(name) as { id: string }
        db.prepare(
          `INSERT OR IGNORE INTO media_tags(media_id, tag_id, source, confidence, created_at)
           VALUES (?, ?, ?, ?, ?)`
        ).run(mediaId, row.id, source, confidence, now)
      }
    })
    tx()
  }

  removeTagFromMedia(mediaId: string, tagId: string): void {
    const db = this.requireDb()
    if (!this.isValidId(mediaId)) throw new Error('Invalid id')
    db.prepare('DELETE FROM media_tags WHERE media_id = ? AND tag_id = ?').run(mediaId, tagId)
  }

  searchMedia(params: { query?: string; tag?: string; mimePrefix?: 'image' | 'video' | null }, limit = 200, offset = 0): MediaRow[] {
    const db = this.requireDb()
    const query = params.query?.trim() || ''
    const tag = params.tag?.trim() || ''
    const mimePrefix = params.mimePrefix ?? null

    const where: string[] = []
    const args: Array<string | number> = []

    if (mimePrefix) {
      where.push('m.mime LIKE ?')
      args.push(`${mimePrefix}/%`)
    }

    if (query) {
      where.push(`m.id IN (SELECT media_id FROM media_fts WHERE media_fts MATCH ?)`)
      args.push(query.replace(/"/g, '""'))
    }

    if (tag) {
      where.push(
        `m.id IN (
          SELECT mt.media_id
          FROM media_tags mt
          JOIN tags t ON t.id = mt.tag_id
          WHERE t.name = ?
        )`
      )
      args.push(tag)
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
    const rows = db
      .prepare(
        `SELECT
          m.id,
          m.title,
          m.original_filename as originalFilename,
          m.mime,
          m.imported_at as importedAt,
          m.thumb_path as thumbPath
        FROM media m
        ${whereSql}
        ORDER BY m.imported_at DESC
        LIMIT ? OFFSET ?`
      )
      .all(...args, limit, offset) as Array<{
      id: string
      title: string | null
      originalFilename: string
      mime: string | null
      importedAt: number
      thumbPath: string | null
    }>

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      originalFilename: r.originalFilename,
      mime: r.mime,
      importedAt: r.importedAt,
      thumbUrl: r.thumbPath ? `rmthumb://thumb/${r.id}` : null,
      originalUrl: `rmorig://orig/${r.id}`
    }))
  }

  createSmartFolder(name: string, ruleJson: string): SmartFolderRow {
    const db = this.requireDb()
    const id = randomUUID()
    db.prepare('INSERT INTO smart_folders(id, name, rule_json, created_at) VALUES (?, ?, ?, ?)').run(
      id,
      name,
      ruleJson,
      Date.now()
    )
    return { id, name, ruleJson }
  }

  listSmartFolders(): SmartFolderRow[] {
    const db = this.requireDb()
    return db
      .prepare('SELECT id, name, rule_json as ruleJson FROM smart_folders ORDER BY created_at DESC')
      .all() as SmartFolderRow[]
  }

  deleteSmartFolder(id: string): void {
    const db = this.requireDb()
    db.prepare('DELETE FROM smart_folders WHERE id = ?').run(id)
  }

  updateSmartFolder(id: string, patch: { name?: string; ruleJson?: string }): SmartFolderRow {
    const db = this.requireDb()
    const row = db.prepare('SELECT id, name, rule_json as ruleJson FROM smart_folders WHERE id = ?').get(id) as
      | { id: string; name: string; ruleJson: string }
      | undefined
    if (!row) throw new Error('Not found')
    const name = patch.name !== undefined ? patch.name : row.name
    const ruleJson = patch.ruleJson !== undefined ? patch.ruleJson : row.ruleJson
    db.prepare('UPDATE smart_folders SET name = ?, rule_json = ? WHERE id = ?').run(name, ruleJson, id)
    return { id: row.id, name, ruleJson }
  }

  listMediaBySmartFolder(id: string, limit = 200, offset = 0): MediaRow[] {
    const db = this.requireDb()
    const row = db.prepare('SELECT rule_json as ruleJson FROM smart_folders WHERE id = ?').get(id) as
      | { ruleJson: string }
      | undefined
    if (!row) throw new Error('Not found')
    const rule = JSON.parse(row.ruleJson) as unknown
    const { whereSql, args } = this.smartRuleToSql(rule)
    const rows = db
      .prepare(
        `SELECT
          m.id,
          m.title,
          m.original_filename as originalFilename,
          m.mime,
          m.imported_at as importedAt,
          m.thumb_path as thumbPath
        FROM media m
        ${whereSql}
        ORDER BY m.imported_at DESC
        LIMIT ? OFFSET ?`
      )
      .all(...args, limit, offset) as Array<{
      id: string
      title: string | null
      originalFilename: string
      mime: string | null
      importedAt: number
      thumbPath: string | null
    }>
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      originalFilename: r.originalFilename,
      mime: r.mime,
      importedAt: r.importedAt,
      thumbUrl: r.thumbPath ? `rmthumb://thumb/${r.id}` : null,
      originalUrl: `rmorig://orig/${r.id}`
    }))
  }

  listDuplicateGroups(limit = 200, offset = 0): Array<{ media: MediaRow; sourceCount: number }> {
    const db = this.requireDb()
    const rows = db
      .prepare(
        `SELECT
          m.id as id,
          m.title as title,
          m.original_filename as originalFilename,
          m.mime as mime,
          m.imported_at as importedAt,
          m.thumb_path as thumbPath,
          COUNT(ms.source_path) as sourceCount
        FROM media_sources ms
        JOIN media m ON m.id = ms.media_id
        GROUP BY ms.media_id
        HAVING COUNT(ms.source_path) > 1
        ORDER BY sourceCount DESC, m.imported_at DESC
        LIMIT ? OFFSET ?`
      )
      .all(limit, offset) as Array<{
      id: string
      title: string | null
      originalFilename: string
      mime: string | null
      importedAt: number
      thumbPath: string | null
      sourceCount: number
    }>

    return rows.map((r) => ({
      media: {
        id: r.id,
        title: r.title,
        originalFilename: r.originalFilename,
        mime: r.mime,
        importedAt: r.importedAt,
        thumbUrl: r.thumbPath ? `rmthumb://thumb/${r.id}` : null,
        originalUrl: `rmorig://orig/${r.id}`
      },
      sourceCount: r.sourceCount
    }))
  }

  getSetting<T>(key: string): T | null {
    const db = this.requireDb()
    const row = db.prepare('SELECT value_json as valueJson FROM settings WHERE key = ?').get(key) as
      | { valueJson: string }
      | undefined
    if (!row) return null
    return JSON.parse(row.valueJson) as T
  }

  setSetting(key: string, value: unknown): void {
    const db = this.requireDb()
    db.prepare(
      `INSERT INTO settings(key, value_json, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`
    ).run(key, JSON.stringify(value), Date.now())
  }

  getAiInput(mediaId: string): { imagePath: string; imageMime: string; filenameHint: string } {
    const db = this.requireDb()
    const row = db
      .prepare('SELECT original_filename as originalFilename, mime FROM media WHERE id = ?')
      .get(mediaId) as { originalFilename: string; mime: string | null } | undefined
    if (!row) throw new Error('Not found')
    const originalAbs = this.resolveOriginalAbsolutePath(mediaId)
    if (!originalAbs) throw new Error('Not found')

    if (row.mime?.startsWith('video/')) {
      const thumbAbs = this.resolveThumbAbsolutePath(mediaId)
      if (!thumbAbs) throw new Error('Thumbnail not found')
      return { imagePath: thumbAbs, imageMime: 'image/jpeg', filenameHint: row.originalFilename }
    }

    const imageMime = row.mime && row.mime.startsWith('image/') ? row.mime : 'image/jpeg'
    return { imagePath: originalAbs, imageMime, filenameHint: row.originalFilename }
  }

  applyAiSuggestion(mediaId: string, suggestion: { title?: string; tags?: string[] }): MediaDetails | null {
    const title = suggestion.title?.trim()
    if (title) {
      this.setMediaMeta(mediaId, { title })
    }
    if (suggestion.tags?.length) {
      this.addTagsToMedia(mediaId, suggestion.tags, 'ai', null)
    }
    return this.getMediaDetails(mediaId)
  }

  resolveThumbAbsolutePath(id: string): string | null {
    const libraryPath = this.libraryPath
    const db = this.db
    if (!libraryPath || !db) return null
    if (!this.isValidId(id)) return null
    const row = db.prepare('SELECT thumb_path as thumbPath FROM media WHERE id = ?').get(id) as
      | { thumbPath: string | null }
      | undefined
    if (!row?.thumbPath) return null
    return path.join(libraryPath, row.thumbPath)
  }

  resolveOriginalAbsolutePath(id: string): string | null {
    const libraryPath = this.libraryPath
    const db = this.db
    if (!libraryPath || !db) return null
    if (!this.isValidId(id)) return null
    const row = db.prepare('SELECT stored_path as storedPath FROM media WHERE id = ?').get(id) as
      | { storedPath: string }
      | undefined
    if (!row?.storedPath) return null
    return path.join(libraryPath, row.storedPath)
  }

  private requireDb(): LibraryDb {
    if (!this.db) throw new Error('Library not open')
    return this.db
  }

  private requireLibraryPath(): string {
    if (!this.libraryPath) throw new Error('Library not open')
    return this.libraryPath
  }

  private async safeReadJson(filePath: string): Promise<unknown | null> {
    try {
      const text = await readFile(filePath, 'utf-8')
      return JSON.parse(text) as unknown
    } catch {
      return null
    }
  }

  private async assertWritableDirectory(dirPath: string): Promise<void> {
    const testPath = path.join(dirPath, '.rm_write_test')
    try {
      await writeFile(testPath, String(Date.now()), { encoding: 'utf-8', flag: 'w' })
      await unlink(testPath)
    } catch {
      throw new Error(`目标目录不可写：${dirPath}\n请换到项目目录下或临时目录再创建库。`)
    }
  }

  private makeStoredRelativePath(sha256: string, ext: string): string {
    const p1 = sha256.slice(0, 2)
    const p2 = sha256.slice(2, 4)
    return path.join('originals', p1, p2, `${sha256}${ext}`)
  }

  private async computeSha256(filePath: string): Promise<string> {
    const hash = createHash('sha256')
    await new Promise<void>((resolve, reject) => {
      const s = createReadStream(filePath)
      s.on('data', (chunk) => hash.update(chunk))
      s.on('end', () => resolve())
      s.on('error', reject)
    })
    return hash.digest('hex')
  }

  private isValidId(id: string): boolean {
    return /^[a-f0-9]{64}$/.test(id)
  }

  private async generateThumbnailIfPossible(id: string, storedAbs: string, mime: string | null): Promise<string | null> {
    const libraryPath = this.requireLibraryPath()
    const thumbsDir = path.join(libraryPath, 'thumbs')
    await mkdir(thumbsDir, { recursive: true })

    const thumbRel = path.join('thumbs', `${id}.jpg`)
    const thumbAbs = path.join(libraryPath, thumbRel)

    try {
      await stat(thumbAbs)
      return thumbRel
    } catch (error) {
      void error
    }

    if (mime?.startsWith('image/')) {
      await sharp(storedAbs).rotate().resize(320, 320, { fit: 'inside' }).jpeg({ quality: 80 }).toFile(thumbAbs)
      return thumbRel
    }

    if (mime?.startsWith('video/')) {
      await new Promise<void>((resolve, reject) => {
        ffmpeg(storedAbs)
          .seekInput(0)
          .outputOptions(['-frames:v 1'])
          .output(thumbAbs)
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .run()
      })
      return thumbRel
    }

    return null
  }

  private smartRuleToSql(rule: unknown): { whereSql: string; args: Array<string | number> } {
    const where: string[] = []
    const args: Array<string | number> = []

    const r = rule as Partial<{
      mimePrefix: 'image' | 'video'
      tag: string
      tags: string[]
      ratingGte: number
      importedAfter: number
      titleContains: string
    }>

    if (r.mimePrefix) {
      where.push('m.mime LIKE ?')
      args.push(`${r.mimePrefix}/%`)
    }
    if (typeof r.ratingGte === 'number') {
      where.push('m.rating >= ?')
      args.push(r.ratingGte)
    }
    if (typeof r.importedAfter === 'number') {
      where.push('m.imported_at >= ?')
      args.push(r.importedAfter)
    }
    if (r.titleContains && r.titleContains.trim()) {
      where.push('m.title LIKE ?')
      args.push(`%${r.titleContains.trim()}%`)
    }
    const rawTags =
      (Array.isArray(r.tags) ? r.tags : [])
        .map((t) => (typeof t === 'string' ? t.trim() : ''))
        .filter(Boolean) || []
    const singleTag = r.tag && r.tag.trim() ? [r.tag.trim()] : []
    const tagNames = Array.from(new Set([...rawTags, ...singleTag]))

    if (tagNames.length) {
      where.push(
        `m.id IN (
          SELECT mt.media_id
          FROM media_tags mt
          JOIN tags t ON t.id = mt.tag_id
          WHERE t.name IN (${tagNames.map(() => '?').join(',')})
        )`
      )
      args.push(...tagNames)
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
    return { whereSql, args }
  }
}
