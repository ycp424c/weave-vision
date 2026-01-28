import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  ui: {
    onMenuAction(handler: (action: string) => void): () => void {
      const listener = (_event: unknown, action: string) => handler(action)
      ipcRenderer.on('menu:action', listener)
      return () => ipcRenderer.removeListener('menu:action', listener)
    }
  },
  library: {
    getStatus: () => ipcRenderer.invoke('library:getStatus'),
    selectDirectoryForCreate: () => ipcRenderer.invoke('library:selectDirectoryForCreate'),
    selectDirectoryForOpen: () => ipcRenderer.invoke('library:selectDirectoryForOpen'),
    create: (libraryPath: string) => ipcRenderer.invoke('library:create', libraryPath),
    open: (libraryPath: string) => ipcRenderer.invoke('library:open', libraryPath)
  },
  media: {
    pickFiles: () => ipcRenderer.invoke('media:pickFiles'),
    importFiles: (filePaths: string[]) => ipcRenderer.invoke('media:import', filePaths),
    list: (limit?: number, offset?: number) => ipcRenderer.invoke('media:list', limit, offset),
    search: (params: { query?: string; tag?: string; mimePrefix?: 'image' | 'video' | null }, limit?: number, offset?: number) =>
      ipcRenderer.invoke('media:search', params, limit, offset),
    getDetails: (id: string) => ipcRenderer.invoke('media:getDetails', id),
    setMeta: (id: string, patch: { title?: string | null; note?: string | null; rating?: number }) =>
      ipcRenderer.invoke('media:setMeta', id, patch),
    addTags: (mediaId: string, tagNames: string[], source?: 'manual' | 'ai', confidence?: number | null) =>
      ipcRenderer.invoke('media:addTags', mediaId, tagNames, source, confidence),
    removeTag: (mediaId: string, tagId: string) => ipcRenderer.invoke('media:removeTag', mediaId, tagId)
  },
  tags: {
    list: (query?: string, limit?: number) => ipcRenderer.invoke('tags:list', query, limit),
    update: (tagId: string, name: string) => ipcRenderer.invoke('tags:update', tagId, name),
    delete: (tagId: string) => ipcRenderer.invoke('tags:delete', tagId)
  },
  smartFolders: {
    list: () => ipcRenderer.invoke('smartFolders:list'),
    create: (name: string, ruleJson: string) => ipcRenderer.invoke('smartFolders:create', name, ruleJson),
    update: (id: string, patch: { name?: string; ruleJson?: string }) => ipcRenderer.invoke('smartFolders:update', id, patch),
    delete: (id: string) => ipcRenderer.invoke('smartFolders:delete', id),
    listMedia: (id: string, limit?: number, offset?: number) => ipcRenderer.invoke('smartFolders:listMedia', id, limit, offset)
  },
  duplicates: {
    list: (limit?: number, offset?: number) => ipcRenderer.invoke('duplicates:list', limit, offset)
  },
  settings: {
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', key, value)
  },
  ai: {
    analyze: (mediaId: string) => ipcRenderer.invoke('ai:analyze', mediaId),
    apply: (mediaId: string, suggestion: { title?: string; tags?: string[] }) => ipcRenderer.invoke('ai:apply', mediaId, suggestion)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
