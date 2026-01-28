import { protocol } from 'electron'
import type { LibraryManager } from './libraryManager'
import { readFile, stat } from 'fs/promises'
import { createReadStream } from 'fs'
import { lookup as lookupMime } from 'mime-types'
import { Readable } from 'stream'

protocol.registerSchemesAsPrivileged([
  { scheme: 'rmthumb', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } },
  { scheme: 'rmorig', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } }
])

export function registerLibraryProtocols(libraryManager: LibraryManager): void {
  protocol.handle('rmthumb', async (request) => {
    try {
      const u = new URL(request.url)
      const host = u.hostname
      const pathId = u.pathname.replace(/^\//, '')
      const id = /^[a-f0-9]{64}$/.test(host) ? host : pathId
      const abs = libraryManager.resolveThumbAbsolutePath(id)
      if (!abs) return new Response(null, { status: 404 })
      const buf = await readFile(abs)
      const mimeType = (lookupMime(abs) || 'image/jpeg') as string
      return new Response(buf, { status: 200, headers: { 'Content-Type': mimeType } })
    } catch {
      return new Response(null, { status: 404 })
    }
  })

  protocol.handle('rmorig', async (request) => {
    try {
      const u = new URL(request.url)
      const host = u.hostname
      const pathId = u.pathname.replace(/^\//, '')
      const id = /^[a-f0-9]{64}$/.test(host) ? host : pathId
      const abs = libraryManager.resolveOriginalAbsolutePath(id)
      if (!abs) return new Response(null, { status: 404 })
      const mimeType = (lookupMime(abs) || 'application/octet-stream') as string
      const st = await stat(abs)
      const size = st.size
      const range = request.headers.get('range')
      if (range) {
        const m = /^bytes=(\d*)-(\d*)$/i.exec(range.trim())
        if (!m) {
          return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } })
        }
        const startRaw = m[1]
        const endRaw = m[2]
        let start = startRaw ? Number(startRaw) : NaN
        let end = endRaw ? Number(endRaw) : NaN

        if (Number.isNaN(start)) {
          const suffix = Number(endRaw)
          if (Number.isNaN(suffix) || suffix <= 0) {
            return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } })
          }
          start = Math.max(0, size - suffix)
          end = size - 1
        } else {
          if (Number.isNaN(end) || end >= size) end = size - 1
        }

        if (start < 0 || start >= size || end < start) {
          return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } })
        }

        const nodeStream = createReadStream(abs, { start, end })
        const body = Readable.toWeb(nodeStream) as unknown as ReadableStream
        const contentLength = end - start + 1
        return new Response(body, {
          status: 206,
          headers: {
            'Content-Type': mimeType,
            'Content-Length': String(contentLength),
            'Accept-Ranges': 'bytes',
            'Content-Range': `bytes ${start}-${end}/${size}`
          }
        })
      }

      const nodeStream = createReadStream(abs)
      const body = Readable.toWeb(nodeStream) as unknown as ReadableStream
      return new Response(body, {
        status: 200,
        headers: { 'Content-Type': mimeType, 'Content-Length': String(size), 'Accept-Ranges': 'bytes' }
      })
    } catch {
      return new Response(null, { status: 404 })
    }
  })
}
