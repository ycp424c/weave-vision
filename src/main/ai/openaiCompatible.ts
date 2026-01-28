import { readFile } from 'fs/promises'
import sharp from 'sharp'

export type OpenAiCompatibleConfig = {
  baseUrl: string
  apiKey: string
  model: string
}

export type AiSuggestion = {
  title: string
  tags: string[]
}

const MAX_DATA_URI_BYTES = 10 * 1024 * 1024
const TARGET_DATA_URI_BYTES = 9 * 1024 * 1024

function buildCandidateChatCompletionUrls(baseUrl: string): string[] {
  const base = baseUrl.trim()
  if (!base) return []
  const urls = [
    new URL('/compatible-mode/v1/chat/completions', base).toString(),
    new URL('/compatible-mode/chat/completions', base).toString(),
    new URL('/v1/chat/completions', base).toString(),
    new URL('/chat/completions', base).toString()
  ]
  return Array.from(new Set(urls))
}

function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  return text.slice(start, end + 1)
}

async function buildImageDataUrl(params: { imagePath: string; imageMime: string }): Promise<string> {
  const originalBuf = await readFile(params.imagePath)
  const originalBase64 = originalBuf.toString('base64')
  const originalDataUrl = `data:${params.imageMime};base64,${originalBase64}`
  if (Buffer.byteLength(originalDataUrl, 'utf8') <= TARGET_DATA_URI_BYTES) return originalDataUrl

  let width = 1600
  let quality = 80
  for (let i = 0; i < 8; i++) {
    const out = await sharp(originalBuf)
      .rotate()
      .resize({ width, height: width, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer()
    const dataUrl = `data:image/jpeg;base64,${out.toString('base64')}`
    if (Buffer.byteLength(dataUrl, 'utf8') <= TARGET_DATA_URI_BYTES) return dataUrl
    width = Math.max(640, Math.floor(width * 0.85))
    quality = Math.max(35, quality - 10)
  }

  if (Buffer.byteLength(originalDataUrl, 'utf8') > MAX_DATA_URI_BYTES) {
    throw new Error(
      `Image too large for data-url (>${MAX_DATA_URI_BYTES} bytes). Please import a smaller image or configure an AI service that supports hosted image URLs.`
    )
  }
  return originalDataUrl
}

export async function analyzeImageWithOpenAiCompatible(
  config: OpenAiCompatibleConfig,
  params: { imagePath: string; imageMime: string; filenameHint: string }
): Promise<AiSuggestion> {
  const dataUrl = await buildImageDataUrl({ imagePath: params.imagePath, imageMime: params.imageMime })

  const candidates = buildCandidateChatCompletionUrls(config.baseUrl)
  if (!candidates.length) throw new Error('AI baseUrl is empty')

  const prompt = [
    '你是一个作品资源管理工具的 AI 助手。',
    '只允许输出严格 JSON，不要输出任何多余文本。',
    '请根据图片内容生成：',
    '1) 一个简短中文标题（title，<= 20字，避免文件扩展名）',
    '2) 5-12 个中文标签（tags，数组，短词）',
    `文件名参考：${params.filenameHint}`
  ].join('\n')

  const body = {
    model: config.model,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: dataUrl } }
        ]
      }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' }
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const apiKey = config.apiKey?.trim()
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`

  let lastStatus: number | null = null
  let lastText: string | null = null
  for (const url of candidates) {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const text = await res.text()
      lastStatus = res.status
      lastText = text
      if (res.status === 404) continue
      throw new Error(`AI request failed: ${res.status} url=${url} body=${text}`)
    }

    const json = (await res.json()) as unknown
    const root = json && typeof json === 'object' ? (json as Record<string, unknown>) : null
    const choices = Array.isArray(root?.choices) ? (root?.choices as unknown[]) : null
    const first = choices && choices[0] && typeof choices[0] === 'object' ? (choices[0] as Record<string, unknown>) : null
    const message = first && typeof first.message === 'object' ? (first.message as Record<string, unknown>) : null
    const content = typeof message?.content === 'string' ? message.content : undefined
    if (!content) throw new Error('AI response missing content')

    const jsonText = extractFirstJsonObject(content) ?? content
    const parsed = JSON.parse(jsonText) as unknown
    const obj = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
    const title = obj?.title
    const tags = obj?.tags
    if (typeof title !== 'string') throw new Error('AI response invalid title')
    if (!Array.isArray(tags) || !tags.every((t) => typeof t === 'string')) throw new Error('AI response invalid tags')

    return { title: title.trim(), tags: tags.map((t: string) => t.trim()).filter(Boolean) }
  }

  const hint =
    (() => {
      try {
        const u = new URL(config.baseUrl)
        if (u.hostname.endsWith('dashscope.aliyuncs.com')) {
          return '（DashScope 请将 Base URL 设为 https://dashscope.aliyuncs.com/compatible-mode 或 https://dashscope.aliyuncs.com/compatible-mode/v1）'
        }
      } catch {
        return ''
      }
      return ''
    })() || ''

  throw new Error(
    `AI endpoint not found: tried=${candidates.join(',')} lastStatus=${lastStatus ?? ''} lastBody=${lastText ?? ''} ${hint}`.trim()
  )
}
