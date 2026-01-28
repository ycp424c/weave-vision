import { dialog, ipcMain } from 'electron'
import type { BrowserWindow } from 'electron'
import type { LibraryManager } from './library/libraryManager'
import { analyzeImageWithOpenAiCompatible } from './ai/openaiCompatible'
import { setLastLibraryPath } from './appState'

export function registerIpcHandlers(mainWindow: BrowserWindow, libraryManager: LibraryManager): void {
  ipcMain.handle('library:getStatus', () => {
    return libraryManager.getStatus()
  })

  ipcMain.handle('library:selectDirectoryForCreate', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      defaultPath: process.cwd(),
      properties: ['openDirectory', 'createDirectory']
    })
    if (result.canceled) return null
    return result.filePaths[0] || null
  })

  ipcMain.handle('library:selectDirectoryForOpen', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      defaultPath: process.cwd(),
      properties: ['openDirectory']
    })
    if (result.canceled) return null
    return result.filePaths[0] || null
  })

  ipcMain.handle('library:create', async (_event, libraryPath: string) => {
    await libraryManager.createLibrary(libraryPath)
    await libraryManager.openLibrary(libraryPath)
    await setLastLibraryPath(libraryPath)
    return libraryManager.getStatus()
  })

  ipcMain.handle('library:open', async (_event, libraryPath: string) => {
    await libraryManager.openLibrary(libraryPath)
    await setLastLibraryPath(libraryPath)
    return libraryManager.getStatus()
  })

  ipcMain.handle('media:pickFiles', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Media', extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'mp4', 'mov', 'm4v', 'webm'] },
        { name: 'All', extensions: ['*'] }
      ]
    })
    if (result.canceled) return []
    return result.filePaths
  })

  ipcMain.handle('media:import', async (_event, filePaths: string[]) => {
    return libraryManager.importFiles(filePaths)
  })

  ipcMain.handle('media:list', async (_event, limit?: number, offset?: number) => {
    return libraryManager.listMedia(limit, offset)
  })

  ipcMain.handle('media:getDetails', async (_event, id: string) => {
    return libraryManager.getMediaDetails(id)
  })

  ipcMain.handle('media:setMeta', async (_event, id: string, patch: { title?: string | null; note?: string | null; rating?: number }) => {
    libraryManager.setMediaMeta(id, patch)
    return libraryManager.getMediaDetails(id)
  })

  ipcMain.handle('tags:list', async (_event, query?: string, limit?: number) => {
    return libraryManager.listTags(query, limit)
  })

  ipcMain.handle('tags:update', async (_event, tagId: string, name: string) => {
    return libraryManager.updateTag(tagId, name)
  })

  ipcMain.handle('tags:delete', async (_event, tagId: string) => {
    libraryManager.deleteTag(tagId)
    return true
  })

  ipcMain.handle('media:addTags', async (_event, mediaId: string, tagNames: string[], source?: 'manual' | 'ai', confidence?: number | null) => {
    libraryManager.addTagsToMedia(mediaId, tagNames, source ?? 'manual', confidence ?? null)
    return libraryManager.getMediaDetails(mediaId)
  })

  ipcMain.handle('media:removeTag', async (_event, mediaId: string, tagId: string) => {
    libraryManager.removeTagFromMedia(mediaId, tagId)
    return libraryManager.getMediaDetails(mediaId)
  })

  ipcMain.handle('media:search', async (_event, params: { query?: string; tag?: string; mimePrefix?: 'image' | 'video' | null }, limit?: number, offset?: number) => {
    return libraryManager.searchMedia(params, limit, offset)
  })

  ipcMain.handle('smartFolders:list', async () => {
    return libraryManager.listSmartFolders()
  })

  ipcMain.handle('smartFolders:create', async (_event, name: string, ruleJson: string) => {
    return libraryManager.createSmartFolder(name, ruleJson)
  })

  ipcMain.handle('smartFolders:update', async (_event, id: string, patch: { name?: string; ruleJson?: string }) => {
    return libraryManager.updateSmartFolder(id, patch)
  })

  ipcMain.handle('smartFolders:delete', async (_event, id: string) => {
    libraryManager.deleteSmartFolder(id)
    return true
  })

  ipcMain.handle('smartFolders:listMedia', async (_event, id: string, limit?: number, offset?: number) => {
    return libraryManager.listMediaBySmartFolder(id, limit, offset)
  })

  ipcMain.handle('duplicates:list', async (_event, limit?: number, offset?: number) => {
    return libraryManager.listDuplicateGroups(limit, offset)
  })

  ipcMain.handle('settings:get', async (_event, key: string) => {
    return libraryManager.getSetting(key)
  })

  ipcMain.handle('settings:set', async (_event, key: string, value: unknown) => {
    libraryManager.setSetting(key, value)
    return true
  })

  ipcMain.handle('ai:analyze', async (_event, mediaId: string) => {
    const cfg = libraryManager.getSetting('aiConfig') as
      | { baseUrl: string; apiKey: string; model: string }
      | null
    if (!cfg?.baseUrl || !cfg?.model) {
      throw new Error('AI config missing')
    }
    const input = libraryManager.getAiInput(mediaId)
    return analyzeImageWithOpenAiCompatible(
      { baseUrl: cfg.baseUrl, apiKey: cfg.apiKey ?? '', model: cfg.model },
      input
    )
  })

  ipcMain.handle('ai:apply', async (_event, mediaId: string, suggestion: { title?: string; tags?: string[] }) => {
    return libraryManager.applyAiSuggestion(mediaId, suggestion)
  })
}
