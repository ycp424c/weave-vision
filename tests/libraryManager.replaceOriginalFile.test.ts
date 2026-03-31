import test from 'node:test'
import assert from 'node:assert/strict'
import os from 'node:os'
import path from 'node:path'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { LibraryManager } from '../src/main/library/libraryManager'

async function makePng(filePath: string, rgb: { r: number; g: number; b: number }): Promise<Buffer> {
  const buffer = await sharp({
    create: {
      width: 8,
      height: 8,
      channels: 3,
      background: rgb
    }
  })
    .png()
    .toBuffer()
  await writeFile(filePath, buffer)
  return buffer
}

test('replaceOriginalFile rehashes edited content so reimport is skipped as duplicate', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'rm-replace-original-'))
  const libraryPath = path.join(tempRoot, 'library')
  const sourcePath = path.join(tempRoot, 'source.png')
  const editedPath = path.join(tempRoot, 'edited.png')
  const manager = new LibraryManager()

  try {
    await makePng(sourcePath, { r: 255, g: 0, b: 0 })
    const editedBuffer = await makePng(editedPath, { r: 0, g: 0, b: 255 })

    await manager.createLibrary(libraryPath)
    await manager.openLibrary(libraryPath)

    const imported = await manager.importFiles([sourcePath])
    assert.deepEqual(imported, { imported: 1, skipped: 0 })

    const [before] = manager.listMedia()
    assert.ok(before)

    await manager.replaceOriginalFile(before.id, editedBuffer)

    const afterReplace = manager.listMedia()
    assert.equal(afterReplace.length, 1)
    assert.notEqual(afterReplace[0]?.id, before.id)

    const reimportEdited = await manager.importFiles([editedPath])
    assert.deepEqual(reimportEdited, { imported: 0, skipped: 1 })

    const duplicates = manager.listDuplicateGroups()
    assert.equal(duplicates.length, 1)
    assert.equal(duplicates[0]?.media.id, afterReplace[0]?.id)
    assert.equal(duplicates[0]?.sourceCount, 2)
  } finally {
    manager.closeLibrary()
    await rm(tempRoot, { recursive: true, force: true })
  }
})

test('replaceOriginalFile merges into an existing media row when edited content already exists', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'rm-replace-merge-'))
  const libraryPath = path.join(tempRoot, 'library')
  const sourcePath = path.join(tempRoot, 'source.png')
  const targetPath = path.join(tempRoot, 'target.png')
  const manager = new LibraryManager()

  try {
    await makePng(sourcePath, { r: 255, g: 0, b: 0 })
    const targetBuffer = await makePng(targetPath, { r: 0, g: 255, b: 0 })

    await manager.createLibrary(libraryPath)
    await manager.openLibrary(libraryPath)

    await manager.importFiles([sourcePath, targetPath])
    const [first, second] = manager.listMedia()
    assert.ok(first)
    assert.ok(second)

    const sourceMedia = first.originalFilename === 'source.png' ? first : second
    const targetMedia = first.originalFilename === 'target.png' ? first : second

    manager.addTagsToMedia(sourceMedia.id, ['source-tag'])
    manager.addTagsToMedia(targetMedia.id, ['target-tag'])
    const folder = manager.createFolder('edited')
    manager.addMediaToFolder(folder.id, [sourceMedia.id])

    const merged = await manager.replaceOriginalFile(sourceMedia.id, targetBuffer)
    assert.ok(merged)
    assert.equal(merged.id, targetMedia.id)

    const list = manager.listMedia()
    assert.equal(list.length, 1)
    assert.equal(list[0]?.id, targetMedia.id)

    const details = manager.getMediaDetails(targetMedia.id)
    assert.ok(details)
    assert.deepEqual(
      details.tags.map((tag) => tag.name).sort(),
      ['source-tag', 'target-tag']
    )
    assert.deepEqual(details.sources.sort(), [sourcePath, targetPath].sort())

    const folderItems = manager.listMediaByFolder(folder.id)
    assert.equal(folderItems.length, 1)
    assert.equal(folderItems[0]?.id, targetMedia.id)

    assert.equal(manager.getMediaDetails(sourceMedia.id), null)

    const duplicates = manager.listDuplicateGroups()
    assert.equal(duplicates.length, 1)
    assert.equal(duplicates[0]?.media.id, targetMedia.id)
    assert.equal(duplicates[0]?.sourceCount, 2)
  } finally {
    manager.closeLibrary()
    await rm(tempRoot, { recursive: true, force: true })
  }
})
