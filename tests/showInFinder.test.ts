import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { showMediaInFinder } from '../src/main/media/showInFinder'

test('showMediaInFinder calls finder and resolves true when path exists', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'show-in-finder-'))
  const tempFile = path.join(tempDir, 'media-1.png')
  await writeFile(tempFile, 'test')

  const calls: string[] = []

  try {
    const result = await showMediaInFinder('media-1', {
      resolveOriginalAbsolutePath: (mediaId) => {
        assert.equal(mediaId, 'media-1')
        return tempFile
      },
      showItemInFolder: async (absPath) => {
        calls.push(absPath)
      }
    })

    assert.equal(result, true)
    assert.deepEqual(calls, [tempFile])
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
})

test('showMediaInFinder throws when path cannot be resolved', async () => {
  await assert.rejects(
    () =>
      showMediaInFinder('missing-media', {
        resolveOriginalAbsolutePath: () => null,
        showItemInFolder: async () => {
          throw new Error('should not be called')
        }
      }),
    /资源文件不存在/
  )
})

test('showMediaInFinder throws when resolved path no longer exists', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'show-in-finder-missing-'))
  const missingFile = path.join(tempDir, 'missing.png')

  try {
    await assert.rejects(
      () =>
        showMediaInFinder('missing-on-disk', {
          resolveOriginalAbsolutePath: () => missingFile,
          showItemInFolder: async () => {
            throw new Error('should not be called')
          }
        }),
      /资源文件不存在/
    )
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
})
