import { ElectronAPI } from '@electron-toolkit/preload'

export type LibraryStatus = {
  open: boolean
  libraryPath: string | null
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

export type MediaTag = {
  id: string
  name: string
  source: string
  confidence: number | null
}

export type MediaDetails = MediaRow & {
  note: string | null
  rating: number
  tags: MediaTag[]
  sources: string[]
}

export type TagRow = { id: string; name: string }

export type SmartFolderRow = { id: string; name: string; ruleJson: string }

export type DuplicateGroupRow = { media: MediaRow; sourceCount: number }

export type AiSuggestion = { title: string; tags: string[] }

export type ImportResult = {
  imported: number
  skipped: number
}

export type ResourceManagerApi = {
  ui: {
    onMenuAction: (handler: (action: string) => void) => () => void
  }
  library: {
    getStatus: () => Promise<LibraryStatus>
    selectDirectoryForCreate: () => Promise<string | null>
    selectDirectoryForOpen: () => Promise<string | null>
    create: (libraryPath: string) => Promise<LibraryStatus>
    open: (libraryPath: string) => Promise<LibraryStatus>
  }
  media: {
    pickFiles: () => Promise<string[]>
    importFiles: (filePaths: string[]) => Promise<ImportResult>
    list: (limit?: number, offset?: number) => Promise<MediaRow[]>
    search: (
      params: { query?: string; tag?: string; mimePrefix?: 'image' | 'video' | null },
      limit?: number,
      offset?: number
    ) => Promise<MediaRow[]>
    getDetails: (id: string) => Promise<MediaDetails | null>
    setMeta: (id: string, patch: { title?: string | null; note?: string | null; rating?: number }) => Promise<MediaDetails | null>
    addTags: (mediaId: string, tagNames: string[], source?: 'manual' | 'ai', confidence?: number | null) => Promise<MediaDetails | null>
    removeTag: (mediaId: string, tagId: string) => Promise<MediaDetails | null>
  }
  tags: {
    list: (query?: string, limit?: number) => Promise<TagRow[]>
    update: (tagId: string, name: string) => Promise<TagRow>
    delete: (tagId: string) => Promise<boolean>
  }
  smartFolders: {
    list: () => Promise<SmartFolderRow[]>
    create: (name: string, ruleJson: string) => Promise<SmartFolderRow>
    update: (id: string, patch: { name?: string; ruleJson?: string }) => Promise<SmartFolderRow>
    delete: (id: string) => Promise<boolean>
    listMedia: (id: string, limit?: number, offset?: number) => Promise<MediaRow[]>
  }
  duplicates: {
    list: (limit?: number, offset?: number) => Promise<DuplicateGroupRow[]>
  }
  settings: {
    get: (key: string) => Promise<unknown>
    set: (key: string, value: unknown) => Promise<boolean>
  }
  ai: {
    analyze: (mediaId: string) => Promise<AiSuggestion>
    apply: (mediaId: string, suggestion: { title?: string; tags?: string[] }) => Promise<MediaDetails | null>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ResourceManagerApi
  }
}
