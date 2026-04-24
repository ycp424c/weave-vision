import { access } from 'node:fs/promises'

export type ShowInFinderDeps = {
  resolveOriginalAbsolutePath(mediaId: string): string | null
  showItemInFolder(absPath: string): void | Promise<void>
}

export async function showMediaInFinder(mediaId: string, deps: ShowInFinderDeps): Promise<true> {
  const absPath = deps.resolveOriginalAbsolutePath(mediaId)
  if (!absPath) {
    throw new Error(`资源文件不存在: ${mediaId}`)
  }

  try {
    await access(absPath)
  } catch {
    throw new Error(`资源文件不存在: ${absPath}`)
  }

  await deps.showItemInFolder(absPath)
  return true
}
