import { readFileSync, writeFileSync } from 'fs'

const API_KEY = 'sk-e032fab7bee64d7d83b73f7d516ef6e4'
const HOST = 'https://dashscope.aliyuncs.com'
const IMAGE_PATH = '/Users/justynchen/Documents/code/resource-manager/example-lib/originals/42/2f/422f51e91d83abc33e7195360b43c1e11e8b916afed8eabadd8e91e5ed9f6245.png'

// Step 1: Build base64 data URL
console.log('Reading image...')
const buf = readFileSync(IMAGE_PATH)
const dataUrl = `data:image/png;base64,${buf.toString('base64')}`
console.log(`Image size: ${buf.length} bytes, data URL length: ${dataUrl.length}`)

// Step 2: Submit task
console.log('\nSubmitting task to DashScope (description_edit)...')
const submitUrl = `${HOST}/api/v1/services/aigc/image2image/image-synthesis`
const body = {
  model: 'wanx2.1-imageedit',
  input: {
    function: 'description_edit',
    base_image_url: dataUrl,
    prompt: '去除图片角落处的文字水印，保持图片其他内容完全不变'
  },
  parameters: {
    n: 1,
    watermark: false
  }
}

const submitRes = await fetch(submitUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
    'X-DashScope-Async': 'enable'
  },
  body: JSON.stringify(body)
})

const submitJson = await submitRes.json()
console.log('Submit response:', JSON.stringify(submitJson, null, 2))

if (!submitRes.ok || !submitJson.output?.task_id) {
  console.error('Failed to submit task!')
  process.exit(1)
}

const taskId = submitJson.output.task_id
console.log(`Task ID: ${taskId}`)

// Step 3: Poll for result
console.log('\nPolling for result...')
const startTime = Date.now()
while (Date.now() - startTime < 120000) {
  await new Promise(r => setTimeout(r, 3000))

  const pollRes = await fetch(`${HOST}/api/v1/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  })
  const pollJson = await pollRes.json()
  const status = pollJson.output?.task_status
  console.log(`  Status: ${status} (${Math.round((Date.now() - startTime) / 1000)}s)`)

  if (status === 'SUCCEEDED') {
    console.log('\nTask SUCCEEDED!')
    console.log('Results:', JSON.stringify(pollJson.output?.results, null, 2))

    const resultUrl = pollJson.output?.results?.[0]?.url
    if (resultUrl) {
      console.log(`\nDownloading result from: ${resultUrl}`)
      const imgRes = await fetch(resultUrl)
      const imgBuf = Buffer.from(await imgRes.arrayBuffer())
      const outPath = '/tmp/watermark_removed_desc_edit.png'
      writeFileSync(outPath, imgBuf)
      console.log(`Saved to: ${outPath} (${imgBuf.length} bytes)`)
    }
    process.exit(0)
  }

  if (status === 'FAILED' || status === 'CANCELED') {
    console.error('Task failed:', JSON.stringify(pollJson.output, null, 2))
    process.exit(1)
  }
}

console.error('Timed out!')
process.exit(1)
