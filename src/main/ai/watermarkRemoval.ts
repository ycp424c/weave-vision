import { readFile } from 'fs/promises'
import sharp from 'sharp'

export type WatermarkRemovalConfig = {
  apiKey: string
  baseUrl: string
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const TARGET_IMAGE_BYTES = 9 * 1024 * 1024

async function buildImageDataUrl(imagePath: string, imageMime: string): Promise<string> {
  const originalBuf = await readFile(imagePath)
  const originalBase64 = originalBuf.toString('base64')
  const originalDataUrl = `data:${imageMime};base64,${originalBase64}`
  if (Buffer.byteLength(originalDataUrl, 'utf8') <= TARGET_IMAGE_BYTES) return originalDataUrl

  let width = 2048
  let quality = 85
  for (let i = 0; i < 8; i++) {
    const out = await sharp(originalBuf)
      .rotate()
      .resize({ width, height: width, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer()
    const dataUrl = `data:image/jpeg;base64,${out.toString('base64')}`
    if (Buffer.byteLength(dataUrl, 'utf8') <= TARGET_IMAGE_BYTES) return dataUrl
    width = Math.max(1024, Math.floor(width * 0.85))
    quality = Math.max(50, quality - 10)
  }

  if (Buffer.byteLength(originalDataUrl, 'utf8') > MAX_IMAGE_BYTES) {
    throw new Error('Image too large for watermark removal (>10MB after compression)')
  }
  return originalDataUrl
}

function resolveDashScopeHost(baseUrl: string): string {
  try {
    const u = new URL(baseUrl)
    if (u.hostname.endsWith('dashscope.aliyuncs.com')) {
      return 'https://dashscope.aliyuncs.com'
    }
  } catch {
    // ignore
  }
  return 'https://dashscope.aliyuncs.com'
}

type TaskResponse = {
  request_id: string
  output: {
    task_id: string
    task_status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED' | 'UNKNOWN'
    task_metrics?: Record<string, unknown>
    results?: Array<{ url?: string }>
    code?: string
    message?: string
  }
}

async function submitTask(
  host: string,
  apiKey: string,
  imageDataUrl: string
): Promise<string> {
  const url = `${host}/api/v1/services/aigc/image2image/image-synthesis`
  const body = {
    model: 'wanx2.1-imageedit',
    input: {
      function: 'description_edit',
      base_image_url: imageDataUrl,
      prompt: '去除图片角落处的文字水印，保持图片其他内容完全不变'
    },
    parameters: {
      n: 1,
      watermark: false
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'X-DashScope-Async': 'enable'
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`DashScope task submit failed: ${res.status} ${text}`)
  }

  const json = (await res.json()) as TaskResponse
  if (!json.output?.task_id) {
    throw new Error(`DashScope response missing task_id: ${JSON.stringify(json)}`)
  }

  return json.output.task_id
}

async function pollTask(
  host: string,
  apiKey: string,
  taskId: string,
  maxWaitMs = 120_000
): Promise<string> {
  const startTime = Date.now()
  const pollInterval = 2000

  while (Date.now() - startTime < maxWaitMs) {
    const url = `${host}/api/v1/tasks/${taskId}`
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiKey}` }
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`DashScope poll failed: ${res.status} ${text}`)
    }

    const json = (await res.json()) as TaskResponse
    const status = json.output?.task_status

    if (status === 'SUCCEEDED') {
      const results = json.output?.results
      if (!results?.length || !results[0].url) {
        throw new Error('DashScope task succeeded but no result URL found')
      }
      return results[0].url
    }

    if (status === 'FAILED' || status === 'CANCELED') {
      const msg = json.output?.message || json.output?.code || 'Unknown error'
      throw new Error(`DashScope task ${status}: ${msg}`)
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval))
  }

  throw new Error(`DashScope task timed out after ${maxWaitMs / 1000}s`)
}

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to download result image: ${res.status}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

export async function removeWatermark(
  config: WatermarkRemovalConfig,
  params: { imagePath: string; imageMime: string }
): Promise<Buffer> {
  const apiKey = config.apiKey?.trim()
  if (!apiKey) {
    throw new Error('AI API Key is required for watermark removal')
  }

  const host = resolveDashScopeHost(config.baseUrl)
  const dataUrl = await buildImageDataUrl(params.imagePath, params.imageMime)
  const taskId = await submitTask(host, apiKey, dataUrl)
  const resultUrl = await pollTask(host, apiKey, taskId)
  return downloadImage(resultUrl)
}
