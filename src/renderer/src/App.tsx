import { useEffect, useState, useRef } from 'react'

// --- Icons ---
const IconLibrary = (): React.JSX.Element => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
  </svg>
)
const IconFolder = (): React.JSX.Element => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
  </svg>
)
const IconSmart = (): React.JSX.Element => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2.06 11L15 15.28 12.06 17l.78-3.33-2.59-2.24 3.41-.29L15 8l1.34 3.14 3.41.29-2.59 2.24.78 3.33z" />
  </svg>
)
const IconTag = (): React.JSX.Element => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z" />
  </svg>
)
const IconSettings = (): React.JSX.Element => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
)
const IconSearch = (): React.JSX.Element => (
  <svg className="searchIcon" viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
)
const IconAi = (): React.JSX.Element => (
  <svg className="btnIcon" viewBox="0 0 24 24">
    <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
  </svg>
)
const IconAdd = (): React.JSX.Element => (
  <svg className="btnIcon" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
)
const IconMenu = (): React.JSX.Element => (
  <svg className="btnIcon" viewBox="0 0 24 24">
     <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
)
const IconClose = (): React.JSX.Element => (
  <svg className="navIcon" viewBox="0 0 24 24" style={{ width: 24, height: 24 }}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
)
const IconEdit = (): React.JSX.Element => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
)
const IconDelete = (): React.JSX.Element => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
)
const IconAudio = (): React.JSX.Element => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
  </svg>
)

type LibraryStatus = { open: boolean; libraryPath: string | null }
type MediaRow = {
  id: string
  title: string | null
  originalFilename: string
  mime: string | null
  importedAt: number
  thumbUrl: string | null
  originalUrl: string
}
type MediaDetails = MediaRow & {
  note: string | null
  lyrics: string | null
  duration: number | null
  size: number
  rating: number
  tags: Array<{ id: string; name: string; source: string; confidence: number | null }>
  sources: string[]
}
type TagRow = { id: string; name: string }
type SmartFolderRow = { id: string; name: string; ruleJson: string }
type FolderRow = { id: string; name: string }
type DuplicateGroupRow = { media: MediaRow; sourceCount: number }
type AiSuggestion = { title: string; tags: string[] }
const IMAGE_ZOOM_OPTIONS = [1, 1.5, 2, 3]
type SidebarSectionKey = 'libraries' | 'smartFolders' | 'folders' | 'tags'
type SidebarCollapsedState = Record<SidebarSectionKey, boolean>
const DEFAULT_SIDEBAR_COLLAPSED: SidebarCollapsedState = {
  libraries: false,
  smartFolders: false,
  folders: false,
  tags: false
}

type View = 'all' | 'images' | 'videos' | 'audio' | 'smart' | 'folder' | 'duplicates'

function App(): React.JSX.Element {
  const api = (window as unknown as { api?: typeof window.api }).api
  const [status, setStatus] = useState<LibraryStatus | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>('all')
  const [smartFolders, setSmartFolders] = useState<SmartFolderRow[]>([])
  const [activeSmartId, setActiveSmartId] = useState<string | null>(null)
  const [folders, setFolders] = useState<FolderRow[]>([])
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [items, setItems] = useState<MediaRow[]>([])
  const [duplicates, setDuplicates] = useState<DuplicateGroupRow[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selection, setSelection] = useState<string[]>([])
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null)
  const [details, setDetails] = useState<MediaDetails | null>(null)
  const [showSmartEditor, setShowSmartEditor] = useState(false)
  const [smartEditId, setSmartEditId] = useState<string | null>(null)
  const [smartName, setSmartName] = useState('')
  const [smartType, setSmartType] = useState<'image' | 'video' | ''>('')
  const [smartTag, setSmartTag] = useState('')
  const [smartTagSuggestions, setSmartTagSuggestions] = useState<TagRow[]>([])
  const [smartTagSuggestionsOpen, setSmartTagSuggestionsOpen] = useState(false)
  const [smartRatingGte, setSmartRatingGte] = useState('')
  const [smartTitleContains, setSmartTitleContains] = useState('')
  const [showFolderEditor, setShowFolderEditor] = useState(false)
  const [folderEditId, setFolderEditId] = useState<string | null>(null)
  const [folderName, setFolderName] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tagSuggestions, setTagSuggestions] = useState<TagRow[]>([])
  const [tagSuggestionsOpen, setTagSuggestionsOpen] = useState(false)
  const [showTagLibrary, setShowTagLibrary] = useState(false)
  const [tagLibraryQuery, setTagLibraryQuery] = useState('')
  const [tagLibraryItems, setTagLibraryItems] = useState<TagRow[]>([])
  const [tagEditingId, setTagEditingId] = useState<string | null>(null)
  const [tagEditingName, setTagEditingName] = useState('')
  const [showAiSettings, setShowAiSettings] = useState(false)
  const [aiBaseUrl, setAiBaseUrl] = useState('')
  const [aiApiKey, setAiApiKey] = useState('')
  const [aiModel, setAiModel] = useState('')
  // const [dragActive, setDragActive] = useState(false)
  const [showAppMenu, setShowAppMenu] = useState(false)
  const [aiTotal, setAiTotal] = useState(0)
  const [aiDone, setAiDone] = useState(0)
  const [aiPhase, setAiPhase] = useState<'analyzing' | 'applying' | null>(null)
  const [showAiPreview, setShowAiPreview] = useState(false)
  const [aiPreviewItems, setAiPreviewItems] = useState<
    Array<{
      id: string
      filename: string
      beforeTitle: string
      afterTitle: string
      addedTags: string[]
      suggestion: AiSuggestion
    }>
  >([])
  const [showSmartDeleteConfirm, setShowSmartDeleteConfirm] = useState(false)
  const [smartDeleteTarget, setSmartDeleteTarget] = useState<SmartFolderRow | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioTime, setAudioTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [lyricsInput, setLyricsInput] = useState('')
  const [imageZoom, setImageZoom] = useState(1)
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [imageCopying, setImageCopying] = useState(false)
  const [imageCopied, setImageCopied] = useState(false)
  const imageCopyFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<SidebarCollapsedState>(DEFAULT_SIDEBAR_COLLAPSED)
  const [draggingMediaIds, setDraggingMediaIds] = useState<string[]>([])
  const [folderDropTargetId, setFolderDropTargetId] = useState<string | null>(null)
  const [watermarkRemoving, setWatermarkRemoving] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [watermarkPreview, setWatermarkPreview] = useState<{ mediaId: string; beforeUrl: string; afterDataUrl: string } | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; mediaIds: string[] } | null>(null)

  // const libraryPath = useMemo(() => status?.libraryPath ?? null, [status])

  const loadSmartFolders = async (): Promise<void> => {
    if (!api) return
    const list = await api.smartFolders.list()
    setSmartFolders(list)
  }

  const loadFolders = async (): Promise<void> => {
    if (!api) return
    const list = await api.folders.list()
    setFolders(list)
  }

  const normalizeSidebarCollapsed = (raw: unknown): SidebarCollapsedState => {
    if (!raw || typeof raw !== 'object') return DEFAULT_SIDEBAR_COLLAPSED
    const obj = raw as Record<string, unknown>
    return {
      libraries: typeof obj.libraries === 'boolean' ? obj.libraries : DEFAULT_SIDEBAR_COLLAPSED.libraries,
      smartFolders: typeof obj.smartFolders === 'boolean' ? obj.smartFolders : DEFAULT_SIDEBAR_COLLAPSED.smartFolders,
      folders: typeof obj.folders === 'boolean' ? obj.folders : DEFAULT_SIDEBAR_COLLAPSED.folders,
      tags: typeof obj.tags === 'boolean' ? obj.tags : DEFAULT_SIDEBAR_COLLAPSED.tags
    }
  }

  const loadSidebarCollapsed = async (): Promise<void> => {
    if (!api) return
    const saved = await api.settings.get('sidebarCollapsed')
    setSidebarCollapsed(normalizeSidebarCollapsed(saved))
  }

  const loadContent = async (): Promise<void> => {
    if (!api) return
    if (!status?.open) return
    if (view === 'duplicates') {
      const list = await api.duplicates.list(500, 0)
      const q = query.trim()
      const t = tagFilter.trim()
      if (q || t) {
        const matched = await api.media.search({ query: q || undefined, tag: t || undefined, mimePrefix: null }, 500, 0)
        const matchedIds = new Set(matched.map((m) => m.id))
        setDuplicates(list.filter((g) => matchedIds.has(g.media.id)))
      } else {
        setDuplicates(list)
      }
      setItems([])
      return
    }
    setDuplicates([])
    if (view === 'smart') {
      await loadSmartFolders()
      if (!activeSmartId) {
        setItems([])
        return
      }
      const list = await api.smartFolders.listMedia(activeSmartId, 500, 0)
      const q = query.trim()
      const t = tagFilter.trim()
      if (q || t) {
        const matched = await api.media.search({ query: q || undefined, tag: t || undefined, mimePrefix: null }, 500, 0)
        const matchedIds = new Set(matched.map((m) => m.id))
        setItems(list.filter((m) => matchedIds.has(m.id)))
      } else {
        setItems(list)
      }
      return
    }
    if (view === 'folder') {
      await loadFolders()
      if (!activeFolderId) {
        setItems([])
        return
      }
      const list = await api.folders.listMedia(activeFolderId, 500, 0)
      const q = query.trim()
      const t = tagFilter.trim()
      if (q || t) {
        const matched = await api.media.search({ query: q || undefined, tag: t || undefined, mimePrefix: null }, 500, 0)
        const matchedIds = new Set(matched.map((m) => m.id))
        setItems(list.filter((m) => matchedIds.has(m.id)))
      } else {
        setItems(list)
      }
      return
    }
    const mimePrefix = view === 'images' ? 'image' : view === 'videos' ? 'video' : view === 'audio' ? 'audio' : null
    if (query.trim() || tagFilter.trim() || mimePrefix) {
      const list = await api.media.search(
        { query: query.trim() || undefined, tag: tagFilter.trim() || undefined, mimePrefix },
        500,
        0
      )
      setItems(list)
      return
    }
    const list = await api.media.list(500, 0)
    setItems(list)
  }

  useEffect(() => {
    void (async () => {
      if (!api) return
      const s = await api.library.getStatus()
      setStatus(s)
      if (s.open) {
        await loadSmartFolders()
        await loadFolders()
        await loadSidebarCollapsed()
        const cfg = (await api.settings.get('aiConfig')) as unknown
        const obj = cfg && typeof cfg === 'object' ? (cfg as Record<string, unknown>) : null
        if (obj?.baseUrl) setAiBaseUrl(String(obj.baseUrl))
        if (obj?.apiKey) setAiApiKey(String(obj.apiKey))
        if (obj?.model) setAiModel(String(obj.model))
        await loadContent()
      }
    })()
  }, [])

  useEffect(() => {
    if (!api) return
    if (!status?.open) return

    const onDragOver = (e: DragEvent): void => {
      if (!e.dataTransfer) return
      if (!Array.from(e.dataTransfer.types).includes('Files')) return
      e.preventDefault()
      // setDragActive(true)
    }

    const onDragLeave = (e: DragEvent): void => {
      e.preventDefault()
      // setDragActive(false)
    }

    const onDrop = (e: DragEvent): void => {
      if (!e.dataTransfer) return
      if (!Array.from(e.dataTransfer.types).includes('Files')) return
      e.preventDefault()
      // setDragActive(false)
      const files = Array.from(e.dataTransfer.files)
      const paths = files
        .map((f) => (f as unknown as { path?: string }).path)
        .filter((p): p is string => Boolean(p))
      if (!paths.length) return
      void (async () => {
        setBusy(true)
        try {
          await api.media.importFiles(paths)
          await loadContent()
        } catch (err) {
          setError(formatError(err))
        } finally {
          setBusy(false)
        }
      })()
    }

    window.addEventListener('dragover', onDragOver)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('drop', onDrop)
    return () => {
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('dragleave', onDragLeave)
      window.removeEventListener('drop', onDrop)
    }
  }, [api, status?.open])

  useEffect(() => {
    void loadContent()
  }, [status?.open, view, activeSmartId, activeFolderId, query, tagFilter])

  useEffect(() => {
    if (!api) return
    const off = api.ui.onMenuAction((action) => {
      if (action === 'library:create') void handleCreateLibrary()
      if (action === 'library:open') void handleOpenLibrary()
      if (action === 'media:import') void handleImport()
      if (action === 'ai:settings') setShowAiSettings(true)
      if (action === 'ai:autoTag') requestAiAutoTag()
      if (action === 'tags:library') void openTagLibrary()
    })
    return () => off()
  }, [api, selectedId, selection, busy, aiPhase, status?.open, tagLibraryQuery])

  useEffect(() => {
    setSelectedId(null)
    setSelection([])
    setLastSelectedId(null)
    setDetails(null)
    setShowImagePreview(false)
    setDraggingMediaIds([])
    setFolderDropTargetId(null)
  }, [view, activeSmartId, activeFolderId])

  useEffect(() => {
    void (async () => {
      if (!api) return
      if (!selectedId) {
        setDetails(null)
        return
      }
      const d = await api.media.getDetails(selectedId)
      setDetails(d)
      setLyricsInput(d?.lyrics || '')
      setImageZoom(1)
      setShowImagePreview(false)
      setImageCopying(false)
      setImageCopied(false)
      if (imageCopyFeedbackTimerRef.current) {
        clearTimeout(imageCopyFeedbackTimerRef.current)
        imageCopyFeedbackTimerRef.current = null
      }
    })()
  }, [selectedId])

  useEffect(() => {
    if (!showImagePreview) return
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setShowImagePreview(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [showImagePreview])

  useEffect(() => {
    return () => {
      if (imageCopyFeedbackTimerRef.current) {
        clearTimeout(imageCopyFeedbackTimerRef.current)
        imageCopyFeedbackTimerRef.current = null
      }
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
        toastTimerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!contextMenu) return
    const handleClick = (): void => setContextMenu(null)
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [contextMenu])

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleSaveLyrics = async (): Promise<void> => {
    if (!details || !api) return
    try {
      const updated = await api.media.setMeta(details.id, { lyrics: lyricsInput })
      if (updated) setDetails(updated)
      await loadContent()
    } catch (e) {
      setError(formatError(e))
    }
  }

  const formatError = (e: unknown): string => {
    if (e instanceof Error) return e.message
    return String(e)
  }

  const getMediaTypeInfo = (mime: string | null): { label: string; tone: 'video' | 'image' | 'audio' } | null => {
    if (!mime) return null
    if (mime.startsWith('video/')) return { label: '视频', tone: 'video' }
    if (mime.startsWith('image/')) return { label: '图片', tone: 'image' }
    if (mime.startsWith('audio/')) return { label: '音频', tone: 'audio' }
    return null
  }

  const handleCopyImage = async (): Promise<void> => {
    if (!api || !details) return
    if (!details.mime?.startsWith('image/')) return
    setImageCopying(true)
    try {
      await api.media.copyImageToClipboard(details.id)
      setImageCopied(true)
      if (imageCopyFeedbackTimerRef.current) clearTimeout(imageCopyFeedbackTimerRef.current)
      imageCopyFeedbackTimerRef.current = setTimeout(() => {
        setImageCopied(false)
        imageCopyFeedbackTimerRef.current = null
      }, 1500)
    } catch (e) {
      setError(formatError(e))
    } finally {
      setImageCopying(false)
    }
  }

  const showToast = (msg: string): void => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToastMessage(msg)
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null)
      toastTimerRef.current = null
    }, 2500)
  }

  const remapMediaIds = (ids: string[], fromId: string, toId: string): string[] =>
    Array.from(new Set(ids.map((id) => (id === fromId ? toId : id))))

  const handleRemoveWatermark = async (): Promise<void> => {
    if (!api || !details) return
    if (!details.mime?.startsWith('image/')) return
    setWatermarkRemoving(true)
    try {
      const result = await api.ai.removeWatermark(details.id)
      setWatermarkPreview({
        mediaId: details.id,
        beforeUrl: details.originalUrl,
        afterDataUrl: result.previewDataUrl
      })
    } catch (e) {
      setError(formatError(e))
    } finally {
      setWatermarkRemoving(false)
    }
  }

  const handleApplyWatermark = async (): Promise<void> => {
    if (!api || !watermarkPreview) return
    setBusy(true)
    try {
      const previousId = watermarkPreview.mediaId
      // Extract raw base64 from data URL
      const base64 = watermarkPreview.afterDataUrl.replace(/^data:[^;]+;base64,/, '')
      const updated = await api.ai.applyWatermarkRemoval(previousId, base64)
      if (updated) {
        await loadContent()
        if (updated.id !== previousId) {
          setSelectedId(updated.id)
          setSelection((prev) => remapMediaIds(prev, previousId, updated.id))
          setLastSelectedId((prev) => (prev === previousId ? updated.id : prev))
          setDetails(updated)
        } else {
          const cacheBust = `?t=${Date.now()}`
          setDetails({
            ...updated,
            originalUrl: updated.originalUrl + cacheBust,
            thumbUrl: updated.thumbUrl ? updated.thumbUrl + cacheBust : null
          })
          setItems((prev) =>
            prev.map((m) =>
              m.id === updated.id
                ? {
                    ...m,
                    thumbUrl: m.thumbUrl ? m.thumbUrl + cacheBust : null,
                    originalUrl: m.originalUrl + cacheBust
                  }
                : m
            )
          )
          setDuplicates((prev) =>
            prev.map((group) =>
              group.media.id === updated.id
                ? {
                    ...group,
                    media: {
                      ...group.media,
                      thumbUrl: group.media.thumbUrl ? group.media.thumbUrl + cacheBust : null,
                      originalUrl: group.media.originalUrl + cacheBust
                    }
                  }
                : group
            )
          )
        }
      } else {
        await loadContent()
      }
      setWatermarkPreview(null)
      showToast('AI 去水印完成')
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteMedia = async (ids: string[]): Promise<void> => {
    if (!api || !ids.length) return
    const count = ids.length
    if (!confirm(`确定删除 ${count} 个资源吗？此操作不可撤销。`)) return
    setBusy(true)
    try {
      await api.mediaActions.delete(ids)
      if (selectedId && ids.includes(selectedId)) {
        setSelectedId(null)
        setDetails(null)
      }
      setSelection((prev) => prev.filter((id) => !ids.includes(id)))
      await loadContent()
      showToast(`已删除 ${count} 个资源`)
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
    }
  }

  const parseTagRows = (v: unknown): TagRow[] => {
    if (!Array.isArray(v)) return []
    return v
      .map((x) => (x && typeof x === 'object' ? (x as Record<string, unknown>) : null))
      .filter(Boolean)
      .map((o) => ({ id: String(o!.id ?? ''), name: String(o!.name ?? '') }))
      .filter((t) => t.id && t.name)
  }

  const loadTagLibrary = async (q: string): Promise<void> => {
    if (!api) return
    const list = await api.tags.list(q.trim() || undefined, 200)
    setTagLibraryItems(parseTagRows(list as unknown))
  }

  const handleUpdateTag = async (tagId: string, oldName: string, nextName: string): Promise<void> => {
    if (!api) return
    const trimmed = nextName.trim()
    if (!trimmed) return
    setBusy(true)
    try {
      await api.tags.update(tagId, trimmed)
      if (tagFilter.trim() && tagFilter.trim() === oldName.trim()) setTagFilter(trimmed)
      await loadTagLibrary(tagLibraryQuery)
      if (selectedId) {
        const d = await api.media.getDetails(selectedId)
        setDetails(d)
      }
      await loadContent()
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
      setTagEditingId(null)
      setTagEditingName('')
    }
  }

  const handleDeleteTagFromLibrary = async (tag: TagRow): Promise<void> => {
    if (!api) return
    if (!confirm(`确定删除标签「${tag.name}」吗？\n会从所有资源中移除。`)) return
    setBusy(true)
    try {
      await api.tags.delete(tag.id)
      if (tagFilter.trim() === tag.name.trim()) setTagFilter('')
      await loadTagLibrary(tagLibraryQuery)
      if (selectedId) {
        const d = await api.media.getDetails(selectedId)
        setDetails(d)
      }
      await loadContent()
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
      setTagEditingId(null)
      setTagEditingName('')
    }
  }

  const getLastTagToken = (text: string): string => {
    const parts = text.split(',')
    return (parts[parts.length - 1] ?? '').trim()
  }

  const replaceLastTagToken = (text: string, token: string): string => {
    const parts = text.split(',')
    parts[parts.length - 1] = ` ${token}`
    const joined = parts.join(',').replace(/^ /, '')
    return joined.endsWith(',') ? joined : joined
  }

  useEffect(() => {
    void (async () => {
      if (!api) return
      const token = getLastTagToken(smartTag)
      if (!token) {
        setSmartTagSuggestions([])
        setSmartTagSuggestionsOpen(false)
        return
      }
      const list = await api.tags.list(token, 20)
      const rows = parseTagRows(list as unknown)
      setSmartTagSuggestions(rows)
      setSmartTagSuggestionsOpen(true)
    })()
  }, [smartTag])

  useEffect(() => {
    void (async () => {
      if (!api) return
      const token = getLastTagToken(tagInput)
      if (!token) {
        setTagSuggestions([])
        setTagSuggestionsOpen(false)
        return
      }
      const list = await api.tags.list(token, 20)
      const rows = parseTagRows(list as unknown)
      setTagSuggestions(rows)
      setTagSuggestionsOpen(true)
    })()
  }, [tagInput])

  const handleCreateLibrary = async (): Promise<void> => {
    if (!api) return
    setBusy(true)
    try {
      const dir = await api.library.selectDirectoryForCreate()
      if (!dir) return
      const s = await api.library.create(dir)
      setStatus(s)
      await loadSmartFolders()
      await loadFolders()
      await loadSidebarCollapsed()
      setView('all')
      setActiveSmartId(null)
      setActiveFolderId(null)
      setSelectedId(null)
      await loadContent()
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
    }
  }

  const handleOpenLibrary = async (): Promise<void> => {
    if (!api) return
    setBusy(true)
    try {
      const dir = await api.library.selectDirectoryForOpen()
      if (!dir) return
      const s = await api.library.open(dir)
      setStatus(s)
      await loadSmartFolders()
      await loadFolders()
      await loadSidebarCollapsed()
      setView('all')
      setActiveSmartId(null)
      setActiveFolderId(null)
      setSelectedId(null)
      await loadContent()
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
    }
  }

  const handleImport = async (): Promise<void> => {
    if (!api) return
    setBusy(true)
    try {
      const files = await api.media.pickFiles()
      if (!files.length) return
      const result = await api.media.importFiles(files)
      await loadContent()
      if (result.imported > 0 && result.skipped > 0) {
        showToast(`已导入 ${result.imported} 个，跳过 ${result.skipped} 个重复文件`)
      } else if (result.imported > 0) {
        showToast(`已导入 ${result.imported} 个文件`)
      } else if (result.skipped > 0) {
        showToast(`${result.skipped} 个文件已存在，全部跳过`)
      }
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
    }
  }

  const openTagLibrary = async (): Promise<void> => {
    if (!api) return
    setShowTagLibrary(true)
    await loadTagLibrary(tagLibraryQuery)
  }

  const toggleSidebarSection = (key: SidebarSectionKey): void => {
    if (!api) return
    setSidebarCollapsed((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      void api.settings.set('sidebarCollapsed', next).catch((e) => {
        setError(formatError(e))
      })
      return next
    })
  }

  const handleSelectSmart = (id: string): void => {
    setView('smart')
    setActiveSmartId(id)
    setActiveFolderId(null)
  }

  const handleSelectFolder = (id: string): void => {
    setView('folder')
    setActiveFolderId(id)
    setActiveSmartId(null)
  }

  const resetSmartForm = (): void => {
    setSmartEditId(null)
    setSmartName('')
    setSmartType('')
    setSmartTag('')
    setSmartRatingGte('')
    setSmartTitleContains('')
  }

  const openSmartEditorForCreate = (): void => {
    resetSmartForm()
    setShowSmartEditor(true)
  }

  const resetFolderForm = (): void => {
    setFolderEditId(null)
    setFolderName('')
  }

  const openFolderEditorForCreate = (): void => {
    resetFolderForm()
    setShowFolderEditor(true)
  }

  const startEditSmartFolder = (sf: SmartFolderRow): void => {
    setShowSmartEditor(true)
    setSmartEditId(sf.id)
    setSmartName(sf.name)
    try {
      const parsed = JSON.parse(sf.ruleJson) as unknown
      const rule = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
      const mimePrefix = rule?.mimePrefix
      setSmartType(mimePrefix === 'image' || mimePrefix === 'video' ? mimePrefix : '')
      const tags =
        (Array.isArray(rule?.tags) ? (rule?.tags as unknown[]) : [])
          .map((t) => (typeof t === 'string' ? t : ''))
          .filter(Boolean) || []
      const single = typeof rule?.tag === 'string' ? rule.tag : ''
      const joined = Array.from(new Set([...tags, single].map((t) => t.trim()).filter(Boolean))).join(', ')
      setSmartTag(joined)
      setSmartTitleContains(typeof rule?.titleContains === 'string' ? rule.titleContains : '')
      setSmartRatingGte(typeof rule?.ratingGte === 'number' ? String(rule.ratingGte) : '')
    } catch {
      setSmartType('')
      setSmartTag('')
      setSmartTitleContains('')
      setSmartRatingGte('')
    }
  }

  const startEditFolder = (folder: FolderRow): void => {
    setFolderEditId(folder.id)
    setFolderName(folder.name)
    setShowFolderEditor(true)
  }

  const getVisibleMediaIds = (): string[] =>
    view === 'duplicates' ? duplicates.map((d) => d.media.id) : items.map((m) => m.id)

  const handleSelectItem = (
    id: string,
    modifiers: { shiftKey: boolean; metaKey: boolean; ctrlKey: boolean }
  ): void => {
    const visibleIds = getVisibleMediaIds()
    const isAdditive = modifiers.metaKey || modifiers.ctrlKey

    if (modifiers.shiftKey) {
      const anchorId = lastSelectedId && visibleIds.includes(lastSelectedId) ? lastSelectedId : selectedId
      if (anchorId && visibleIds.includes(anchorId)) {
        const from = visibleIds.indexOf(anchorId)
        const to = visibleIds.indexOf(id)
        const start = Math.min(from, to)
        const end = Math.max(from, to)
        const range = visibleIds.slice(start, end + 1)
        if (isAdditive) {
          setSelection((prev) => Array.from(new Set([...prev, ...range])))
        } else {
          setSelection(range)
        }
        setSelectedId(id)
        setLastSelectedId(id)
        return
      }
    }

    if (isAdditive) {
      setSelection((prev) => {
        const exists = prev.includes(id)
        const next = exists ? prev.filter((x) => x !== id) : [...prev, id]
        if (!next.length) {
          setSelectedId(null)
        } else if (exists && selectedId === id) {
          setSelectedId(next[next.length - 1] ?? null)
        } else {
          setSelectedId(id)
        }
        return next
      })
      setLastSelectedId(id)
      return
    }

    setSelection([id])
    setSelectedId(id)
    setLastSelectedId(id)
  }

  const getSelectedMediaIds = (): string[] => {
    if (selection.length) return selection
    if (selectedId) return [selectedId]
    return []
  }

  const parseDraggedMediaIds = (raw: string): string[] => {
    try {
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) return []
      return parsed.map((id) => String(id)).filter(Boolean)
    } catch {
      return []
    }
  }

  const handleItemDragStart = (event: React.DragEvent<HTMLDivElement>, mediaId: string): void => {
    const ids = selection.includes(mediaId) ? selection : [mediaId]
    setDraggingMediaIds(ids)
    setSelection(ids)
    setSelectedId(ids[0] ?? null)
    event.dataTransfer.effectAllowed = 'copyMove'
    event.dataTransfer.setData('application/x-rm-media-ids', JSON.stringify(ids))
    event.dataTransfer.setData('text/plain', ids.join(','))
  }

  const handleItemDragEnd = (): void => {
    setDraggingMediaIds([])
    setFolderDropTargetId(null)
  }

  const handleDropMediaToFolder = async (targetFolderId: string, mediaIds: string[]): Promise<void> => {
    if (!api) return
    const ids = Array.from(new Set(mediaIds.filter(Boolean)))
    if (!ids.length) return
    setBusy(true)
    try {
      if (view === 'folder' && activeFolderId) {
        if (activeFolderId === targetFolderId) return
        await api.folders.addMedia(targetFolderId, ids)
        await api.folders.removeMedia(activeFolderId, ids)
        setSelection([])
        setSelectedId(null)
        setDetails(null)
        await loadContent()
        return
      }

      await api.folders.addMedia(targetFolderId, ids)
      if (view === 'folder' && activeFolderId === targetFolderId) {
        await loadContent()
      }
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
      setDraggingMediaIds([])
      setFolderDropTargetId(null)
    }
  }

  const handleSaveSmartFolder = async (): Promise<void> => {
    if (!api) return
    setBusy(true)
    try {
      const rule: Record<string, unknown> = {}
      if (smartType) rule.mimePrefix = smartType
      const smartTags = smartTag
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      if (smartTags.length === 1) rule.tag = smartTags[0]
      if (smartTags.length > 1) rule.tags = smartTags
      if (smartTitleContains.trim()) rule.titleContains = smartTitleContains.trim()
      if (smartRatingGte.trim()) {
        const n = Number(smartRatingGte.trim())
        if (!Number.isNaN(n)) rule.ratingGte = n
      }
      const name = smartName.trim() || '智能文件夹'
      const ruleJson = JSON.stringify(rule)
      const created = smartEditId
        ? await api.smartFolders.update(smartEditId, { name, ruleJson })
        : await api.smartFolders.create(name, ruleJson)
      setShowSmartEditor(false)
      resetSmartForm()
      await loadSmartFolders()
      setView('smart')
      setActiveSmartId(created.id)
      setActiveFolderId(null)
      setSelectedId(null)
      await loadContent()
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteSmartFolder = async (id: string): Promise<void> => {
    if (!api) return
    setBusy(true)
    try {
      await api.smartFolders.delete(id)
      await loadSmartFolders()
      if (activeSmartId === id) {
        setActiveSmartId(null)
        setView('smart')
      }
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
    }
  }

  const handleSaveFolder = async (): Promise<void> => {
    if (!api) return
    setBusy(true)
    try {
      const name = folderName.trim() || '普通文件夹'
      const saved = folderEditId ? await api.folders.update(folderEditId, { name }) : await api.folders.create(name)
      setShowFolderEditor(false)
      resetFolderForm()
      await loadFolders()
      setView('folder')
      setActiveFolderId(saved.id)
      setActiveSmartId(null)
      await loadContent()
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteFolder = async (id: string): Promise<void> => {
    if (!api) return
    setBusy(true)
    try {
      await api.folders.delete(id)
      await loadFolders()
      if (activeFolderId === id) {
        setActiveFolderId(null)
        setView('all')
      }
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
    }
  }

  const addSelectionToFolder = async (folderId: string): Promise<void> => {
    if (!api) return
    const ids = getSelectedMediaIds()
    if (!ids.length) {
      setError('请先选择资源')
      return
    }
    setBusy(true)
    try {
      await api.folders.addMedia(folderId, ids)
      if (view === 'folder' && activeFolderId === folderId) {
        await loadContent()
      }
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
    }
  }

  const removeSelectionFromFolder = async (folderId: string): Promise<void> => {
    if (!api) return
    const ids = getSelectedMediaIds()
    if (!ids.length) {
      setError('请先选择资源')
      return
    }
    setBusy(true)
    try {
      await api.folders.removeMedia(folderId, ids)
      setSelectedId(null)
      setSelection([])
      setDetails(null)
      await loadContent()
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
    }
  }

  // const requestDeleteSmartFolder = (sf: SmartFolderRow): void => {
  //   setSmartDeleteTarget(sf)
  //   setShowSmartDeleteConfirm(true)
  // }

  // const handleSaveMeta = async (patch: { title?: string | null; note?: string | null; rating?: number }): Promise<void> => {
  //   if (!details) return
  //   if (!api) return
  //   try {
  //     const updated = await api.media.setMeta(details.id, patch)
  //     if (updated) setDetails(updated)
  //     await loadContent()
  //   } catch (e) {
  //     setError(formatError(e))
  //   }
  // }

  const handleAddTags = async (): Promise<void> => {
    if (!selectedId) return
    if (!api) return
    const parts = tagInput
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
    if (!parts.length) return
    await addTagsToSelection(parts)
    setTagInput('')
    setTagSuggestions([])
    setTagSuggestionsOpen(false)
  }

  const addTagsToSelection = async (parts: string[]): Promise<void> => {
    if (!selectedId) return
    if (!api) return
    const ids = selection.length ? selection : [selectedId]
    try {
      await Promise.all(ids.map((id) => api.media.addTags(id, parts, 'manual', null)))
      const updated = await api.media.getDetails(selectedId)
      if (updated) setDetails(updated)
      await loadContent()
    } catch (e) {
      setError(formatError(e))
    }
  }

  const handleRemoveTag = async (tagId: string): Promise<void> => {
    if (!details) return
    if (!api) return
    try {
      const updated = await api.media.removeTag(details.id, tagId)
      if (updated) setDetails(updated)
      await loadContent()
    } catch (e) {
      setError(formatError(e))
    }
  }

  const handleSaveAiSettings = async (): Promise<void> => {
    if (!api) return
    try {
      await api.settings.set('aiConfig', { baseUrl: aiBaseUrl.trim(), apiKey: aiApiKey.trim(), model: aiModel.trim() })
      setShowAiSettings(false)
    } catch (e) {
      setError(formatError(e))
    }
  }

  const requestAiAutoTag = (): void => {
    if (busy || aiPhase) return
    if (!selectedId) {
      setError('请先选择一个资源')
      return
    }
    const ids = selection.length ? selection : [selectedId]
    void generateAiPreview(ids)
  }

  const generateAiPreview = async (ids: string[]): Promise<void> => {
    if (!api) return
    if (!ids.length) return
    setError(null)
    setAiPreviewItems([])
    setShowAiPreview(false)
    setAiTotal(ids.length)
    setAiDone(0)
    setAiPhase('analyzing')
    setBusy(true)
    try {
      const next: Array<{
        id: string
        filename: string
        beforeTitle: string
        afterTitle: string
        addedTags: string[]
        suggestion: AiSuggestion
      }> = []
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i]
        const before = await api.media.getDetails(id)
        if (!before) continue
        const suggestion = (await api.ai.analyze(id)) as AiSuggestion
        const beforeTitle = before.title ?? ''
        const afterTitle = suggestion.title?.trim() ? suggestion.title.trim() : beforeTitle
        const beforeTags = (before.tags ?? []).map((t) => t.name).filter(Boolean)
        const beforeSet = new Set(beforeTags.map((t) => t.trim()))
        const addedTags = Array.from(
          new Set((suggestion.tags ?? []).map((t) => t.trim()).filter((t) => t && !beforeSet.has(t)))
        )
        next.push({
          id,
          filename: before.originalFilename,
          beforeTitle,
          afterTitle,
          addedTags,
          suggestion: { title: suggestion.title?.trim() ?? '', tags: (suggestion.tags ?? []).map((t) => t.trim()).filter(Boolean) }
        })
        setAiDone(i + 1)
      }
      setAiPreviewItems(next)
      setShowAiPreview(true)
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
      setAiPhase(null)
    }
  }

  const applyAiPreview = async (): Promise<void> => {
    if (!api) return
    if (!aiPreviewItems.length) return
    setAiTotal(aiPreviewItems.length)
    setAiDone(0)
    setAiPhase('applying')
    setBusy(true)
    try {
      for (let i = 0; i < aiPreviewItems.length; i++) {
        const item = aiPreviewItems[i]
        await api.ai.apply(item.id, item.suggestion)
        setAiDone(i + 1)
      }
      const updated = selectedId ? await api.media.getDetails(selectedId) : null
      if (updated) setDetails(updated)
      await loadContent()
      setShowAiPreview(false)
      setAiPreviewItems([])
    } catch (e) {
      setError(formatError(e))
    } finally {
      setBusy(false)
      setAiPhase(null)
    }
  }

  if (!api) {
    return (
      <div className="app">
        <main className="center">
          <div className="card">
            <div className="cardTitle">请在 Electron 窗口中运行</div>
            <div className="cardActions">
              <button className="btn btnPrimary" onClick={() => location.reload()}>刷新</button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!status?.open) {
    return (
      <div className="app">
        <header className="topbar">
          <div className="title">WeaveVision</div>
        </header>
        <main className="center">
          <div className="card">
            <div className="cardTitle">选择或创建资源库</div>
            <div className="cardActions">
              <button className="btn btnPrimary" disabled={busy} onClick={handleCreateLibrary}>
                创建库
              </button>
              <button className="btn btnSecondary" disabled={busy} onClick={handleOpenLibrary}>
                打开库
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <button className="sectionTitle sectionToggle" onClick={() => toggleSidebarSection('libraries')}>
            <span>LIBRARIES</span>
            <span className={sidebarCollapsed.libraries ? 'sectionChevron collapsed' : 'sectionChevron'}>▾</span>
          </button>
          {!sidebarCollapsed.libraries ? (
            <div className={view === 'all' ? 'nav active' : 'nav'} onClick={() => setView('all')}>
              <IconLibrary />
              <span>My Resource Library</span>
            </div>
          ) : null}

          <button className="sectionTitle sectionToggle" onClick={() => toggleSidebarSection('smartFolders')}>
            <span>SMART FOLDERS</span>
            <span className={sidebarCollapsed.smartFolders ? 'sectionChevron collapsed' : 'sectionChevron'}>▾</span>
          </button>
          {!sidebarCollapsed.smartFolders ? (
            <>
              <div className={view === 'images' ? 'nav active' : 'nav'} onClick={() => setView('images')}>
                 <IconFolder />
                <span>Images</span>
              </div>
              <div className={view === 'videos' ? 'nav active' : 'nav'} onClick={() => setView('videos')}>
                 <IconFolder />
                <span>Videos</span>
              </div>
              <div className={view === 'audio' ? 'nav active' : 'nav'} onClick={() => setView('audio')}>
                 <IconAudio />
                <span>Audio</span>
              </div>
              <div className={view === 'duplicates' ? 'nav active' : 'nav'} onClick={() => setView('duplicates')}>
                 <IconFolder />
                <span>Duplicates</span>
              </div>

              {smartFolders.map((sf) => (
                 <div key={sf.id} className={view === 'smart' && activeSmartId === sf.id ? 'nav active' : 'nav'} onClick={() => handleSelectSmart(sf.id)}>
                    <IconSmart />
                    <span style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{sf.name}</span>
                    <button className="navActionBtn" style={{opacity: 0.5}} onClick={(e) => { e.stopPropagation(); startEditSmartFolder(sf); }}>✎</button>
                 </div>
              ))}
              <div className="nav" onClick={() => openSmartEditorForCreate()}>
                <IconAdd />
                <span>New Smart Folder</span>
              </div>
            </>
          ) : null}

          <button className="sectionTitle sectionToggle" onClick={() => toggleSidebarSection('folders')}>
            <span>FOLDERS</span>
            <span className={sidebarCollapsed.folders ? 'sectionChevron collapsed' : 'sectionChevron'}>▾</span>
          </button>
          {!sidebarCollapsed.folders ? (
            <>
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={[
                    view === 'folder' && activeFolderId === folder.id ? 'nav active' : 'nav',
                    folderDropTargetId === folder.id ? 'dropTarget' : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleSelectFolder(folder.id)}
                  onDragOver={(e) => {
                    const hasInternalData =
                      draggingMediaIds.length > 0 || e.dataTransfer.types.includes('application/x-rm-media-ids')
                    if (!hasInternalData) return
                    e.preventDefault()
                    if (view === 'folder' && activeFolderId && activeFolderId !== folder.id) {
                      e.dataTransfer.dropEffect = 'move'
                    } else {
                      e.dataTransfer.dropEffect = 'copy'
                    }
                    setFolderDropTargetId(folder.id)
                  }}
                  onDragLeave={(e) => {
                    const nextNode = e.relatedTarget as Node | null
                    if (!nextNode || !e.currentTarget.contains(nextNode)) {
                      setFolderDropTargetId((prev) => (prev === folder.id ? null : prev))
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const raw = e.dataTransfer.getData('application/x-rm-media-ids')
                    const droppedIds = raw ? parseDraggedMediaIds(raw) : draggingMediaIds
                    if (!droppedIds.length) {
                      setFolderDropTargetId(null)
                      return
                    }
                    void handleDropMediaToFolder(folder.id, droppedIds)
                  }}
                >
                  <IconFolder />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</span>
                  <button
                    className="navActionBtn"
                    title="加入当前选中资源"
                    style={{ opacity: 0.65 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      void addSelectionToFolder(folder.id)
                    }}
                  >
                    ＋
                  </button>
                  <button
                    className="navActionBtn"
                    title="编辑文件夹"
                    style={{ opacity: 0.5 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      startEditFolder(folder)
                    }}
                  >
                    ✎
                  </button>
                </div>
              ))}
              <div className="nav" onClick={() => openFolderEditorForCreate()}>
                <IconAdd />
                <span>New Folder</span>
              </div>
            </>
          ) : null}

          <button className="sectionTitle sectionToggle" onClick={() => toggleSidebarSection('tags')}>
            <span>TAGS</span>
            <span className={sidebarCollapsed.tags ? 'sectionChevron collapsed' : 'sectionChevron'}>▾</span>
          </button>
          {!sidebarCollapsed.tags ? (
            <div className="nav" onClick={() => openTagLibrary()}>
              <IconTag />
              <span>Manage Tags</span>
            </div>
          ) : null}

          <div style={{flex: 1}} />
          <div className="nav" onClick={() => setShowAppMenu(true)}>
             <IconSettings />
             <span>Settings</span>
          </div>
        </aside>

        {/* Main Content */}
        <div className="mainContentWrapper">
            <header className="topbar">
                <div className="searchContainer">
                    <IconSearch />
                    <input 
                        className="searchInput" 
                        value={query} 
                        placeholder="Search resources..." 
                        onChange={(e) => setQuery(e.target.value)} 
                    />
                </div>
                <div className="headerActions">
                    {view === 'folder' && activeFolderId ? (
                        <button
                            className="btn btnSecondary"
                            disabled={busy || !selectedId}
                            onClick={() => void removeSelectionFromFolder(activeFolderId)}
                        >
                            Remove From Folder
                        </button>
                    ) : null}
                    <button className="btn btnPrimary" disabled={busy} onClick={requestAiAutoTag}>
                        <IconAi />
                        <span>AI Tagging</span>
                    </button>
                    <button className="btn btnSecondary" disabled={busy} onClick={handleImport}>
                        <IconAdd />
                        <span>Import</span>
                    </button>
                    <button className="btn btnSecondary" onClick={() => setShowAppMenu(true)}>
                        <IconMenu />
                    </button>
                </div>
            </header>

            <section className="content">
                <div className="grid">
                    {(view === 'duplicates' ? duplicates.map((d) => d.media) : items).map((m) => {
                    const count = view === 'duplicates' ? duplicates.find((d) => d.media.id === m.id)?.sourceCount ?? 0 : 0
                    const isSelected = selection.includes(m.id) || selectedId === m.id
                    const mediaTypeInfo = getMediaTypeInfo(m.mime)
                    return (
                        <div
                            key={m.id}
                            className={isSelected ? 'item selected' : 'item'}
                            onClick={(e) =>
                              handleSelectItem(m.id, {
                                shiftKey: e.shiftKey,
                                metaKey: e.metaKey,
                                ctrlKey: e.ctrlKey
                              })
                            }
                            draggable
                            onDragStart={(e) => handleItemDragStart(e, m.id)}
                            onDragEnd={handleItemDragEnd}
                            onContextMenu={(e) => {
                              e.preventDefault()
                              const ids = selection.includes(m.id) ? selection : [m.id]
                              if (!selection.includes(m.id)) {
                                setSelection([m.id])
                                setSelectedId(m.id)
                              }
                              setContextMenu({ x: e.clientX, y: e.clientY, mediaIds: ids })
                            }}
                        >
                            <div className="thumbWrap">
                              {m.thumbUrl ? (
                                <img className="thumb" src={m.thumbUrl} draggable={false} />
                              ) : m.mime?.startsWith('audio/') ? (
                                <div className="thumb placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                                  <svg style={{ width: 48, height: 48, fill: 'currentColor' }} viewBox="0 0 24 24">
                                    <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="thumb placeholder" />
                              )}
                              {mediaTypeInfo ? (
                                <span className={`thumbTypeTag thumbTypeTag--${mediaTypeInfo.tone}`}>{mediaTypeInfo.label}</span>
                              ) : null}
                            </div>
                            <div className="caption">
                                <div className="itemTitle" title={m.title ?? m.originalFilename}>
                                    {view === 'duplicates' ? `${m.title ?? m.originalFilename}（${count}）` : m.title ?? m.originalFilename}
                                </div>
                                <div className="itemTags">
                                    {/* Display first 2 tags if available, though items doesn't usually have full tags loaded in list, check types. 
                                        MediaRow doesn't have tags. MediaDetails has. The list api usually returns minimal info.
                                        Assuming MediaRow might not have tags populated for list view for performance, but if we wanted tags we'd need API update.
                                        For now, skipping tags in grid or using what's available if extended.
                                    */}
                                </div>
                            </div>
                        </div>
                    )
                    })}
                </div>
            </section>
        </div>

        {/* Detail Panel */}
        <aside className="inspector">
            {details ? (
                <>
                    {details.mime?.startsWith('audio/') ? (
                        <div className="preview" style={{ height: 200, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <div style={{ transform: 'scale(2)', marginBottom: 16, color: '#555' }}>
                                <IconAudio />
                            </div>
                            <audio
                                ref={audioRef}
                                src={details.originalUrl}
                                onPlay={() => setAudioPlaying(true)}
                                onPause={() => setAudioPlaying(false)}
                                onTimeUpdate={(e) => setAudioTime(e.currentTarget.currentTime)}
                                onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
                                onEnded={() => setAudioPlaying(false)}
                            />
                            <div style={{ width: '100%', padding: '0 16px', marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <button 
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 32,
                                        height: 32,
                                        color: '#fff'
                                    }}
                                    onClick={() => {
                                    if (audioRef.current) {
                                        if (audioPlaying) audioRef.current.pause()
                                        else audioRef.current.play()
                                    }
                                }}>
                                    {audioPlaying ? (
                                        <svg viewBox="0 0 24 24" style={{width: 32, height: 32, fill: 'currentColor'}}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" style={{width: 32, height: 32, fill: 'currentColor'}}><path d="M8 5v14l11-7z"/></svg>
                                    )}
                                </button>
                                <div style={{ flex: 1, height: 4, background: '#555', borderRadius: 2, position: 'relative', cursor: 'pointer' }} onClick={(e) => {
                                    if (audioRef.current) {
                                        const rect = e.currentTarget.getBoundingClientRect()
                                        const percent = (e.clientX - rect.left) / rect.width
                                        audioRef.current.currentTime = percent * audioDuration
                                    }
                                }}>
                                    <div style={{ width: `${(audioTime / (audioDuration || 1)) * 100}%`, height: '100%', background: '#4cc71e', borderRadius: 2 }} />
                                </div>
                                <div style={{ fontSize: 11, color: '#ccc', fontFamily: 'Inter', minWidth: 60, textAlign: 'right' }}>
                                    {formatTime(audioTime)} / {formatTime(audioDuration)}
                                </div>
                            </div>
                        </div>
                    ) : details.mime?.startsWith('video/') ? (
                        <div className="preview">
                            <video className="previewMedia" src={details.originalUrl} controls />
                        </div>
                    ) : (
                        <div
                            className="preview previewClickable"
                            title="点击全屏预览"
                            onClick={() => {
                                setImageZoom(1)
                                setShowImagePreview(true)
                            }}
                        >
                            <img className="previewMedia" src={details.originalUrl} />
                            <div className="previewHint">点击全屏预览</div>
                        </div>
                    )}
                    
                    <div className="infoSection">
                        <div className="detailTitle">{details.title ?? details.originalFilename}</div>
                        <div className="propsGrid">
                             {details.mime?.startsWith('audio/') && (
                                 <div className="propRow">
                                    <span className="propLabel">Duration</span>
                                    <span className="propValue">{formatTime(details.duration ? details.duration / 1000 : audioDuration)}</span>
                                 </div>
                             )}
                             <div className="propRow">
                                <span className="propLabel">Size</span>
                                <span className="propValue">{formatSize(details.size)}</span>
                             </div>
                             <div className="propRow">
                                <span className="propLabel">Rating</span>
                                <span className="propValue">{details.rating}</span>
                             </div>
                        </div>
                    </div>

                    <div className="divider" />

                    <div className="tagsSection">
                        <div className="tagsHeader">
                            <span>Tags</span>
                        </div>
                        <div className="tagList">
                            {details.tags.map((t) => (
                                <span key={t.id} className="tag">
                                    {t.name}
                                    <span style={{cursor:'pointer', marginLeft:4}} onClick={() => void handleRemoveTag(t.id)}>×</span>
                                </span>
                            ))}
                        </div>
                        <div className="tagInputWrap">
                            <input
                                className="addTagInput"
                                style={{width: '100%'}}
                                value={tagInput}
                                placeholder="Add tag..."
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        void handleAddTags()
                                    }
                                }}
                                onFocus={() => {
                                    if (tagSuggestions.length) setTagSuggestionsOpen(true)
                                }}
                                onBlur={() => {
                                    setTimeout(() => setTagSuggestionsOpen(false), 150)
                                }}
                            />
                             {tagSuggestionsOpen && tagSuggestions.length ? (
                                <div className="tagSuggest">
                                    {tagSuggestions.map((t) => (
                                    <div
                                        key={t.id}
                                        className="tagSuggestItem"
                                        onMouseDown={(e) => {
                                        e.preventDefault()
                                        setTagInput((prev) => replaceLastTagToken(prev, t.name))
                                        setTagSuggestionsOpen(false)
                                        }}
                                    >
                                        {t.name}
                                    </div>
                                    ))}
                                </div>
                                ) : null}
                        </div>
                    </div>

                    <div className="divider" />

                    {details.mime?.startsWith('audio/') ? (
                        <div className="lyricsSection" style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0, paddingBottom: 16 }}>
                             <div style={{ fontSize: 12, fontWeight: 'bold', color: '#888', fontFamily: 'Inter' }}>LYRICS</div>
                             <textarea 
                                 style={{ 
                                     flex: 1, 
                                     background: '#1e1e1e', 
                                     border: '1px solid #333', 
                                     borderRadius: 4, 
                                     padding: 8, 
                                     color: '#aaa', 
                                     fontFamily: 'Inter', 
                                     fontSize: 12, 
                                     resize: 'none',
                                     outline: 'none'
                                 }}
                                 value={lyricsInput}
                                 onChange={(e) => setLyricsInput(e.target.value)}
                                 placeholder="Paste lyrics here..."
                             />
                             <button className="btn btnPrimary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSaveLyrics}>
                                 Save Lyrics
                             </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {details.mime?.startsWith('image/') ? (
                                <>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="aiActionBtn" style={{ flex: 1 }} disabled={busy || aiPhase !== null} onClick={requestAiAutoTag}>
                                            <IconAi />
                                            <span>AI 分析</span>
                                        </button>
                                        <button
                                            className="aiActionBtn"
                                            style={{ flex: 1 }}
                                            disabled={busy || watermarkRemoving}
                                            onClick={() => void handleRemoveWatermark()}
                                        >
                                            <IconAi />
                                            <span>{watermarkRemoving ? '去水印中...' : 'AI 去水印'}</span>
                                        </button>
                                    </div>
                                    <button
                                        className="btn btnSecondary"
                                        style={{ width: '100%', justifyContent: 'center', height: 36 }}
                                        disabled={imageCopying}
                                        onClick={() => void handleCopyImage()}
                                    >
                                        {imageCopying ? '复制中...' : imageCopied ? '已复制' : '复制图片'}
                                    </button>
                                </>
                            ) : (
                                <button className="aiActionBtn" disabled={busy || aiPhase !== null} onClick={requestAiAutoTag}>
                                    <IconAi />
                                    <span>AI Analyze & Tag</span>
                                </button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div style={{opacity: 0.5, textAlign: 'center', marginTop: 40}}>Select an item to view details</div>
            )}
        </aside>

      </div>

      {/* Modals remain mostly same but with updated styles if needed */}
      {showSmartDeleteConfirm && smartDeleteTarget ? (
        <div
          className="modalOverlay"
          onClick={() => {
            setShowSmartDeleteConfirm(false)
            setSmartDeleteTarget(null)
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">删除智能文件夹</div>
            <div className="modalBody">
              <div className="errorText">确认删除“{smartDeleteTarget.name}”？此操作不可撤销。</div>
              <div className="modalActions">
                <button className="btn btnSecondary"
                  disabled={busy}
                  onClick={() => {
                    setShowSmartDeleteConfirm(false)
                    setSmartDeleteTarget(null)
                  }}
                >
                  取消
                </button>
                <button className="btn btnPrimary"
                  disabled={busy}
                  onClick={() => {
                    const id = smartDeleteTarget.id
                    setShowSmartDeleteConfirm(false)
                    setSmartDeleteTarget(null)
                    void handleDeleteSmartFolder(id)
                  }}
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      
      {showSmartEditor ? (
        <div
          className="modalOverlay"
          onClick={() => {
            setShowSmartEditor(false)
            resetSmartForm()
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">{smartEditId ? '编辑智能文件夹' : '新建智能文件夹'}</div>
            <div className="modalBody">
              <input className="searchInput" style={{background: 'var(--color-panel)', border: '1px solid var(--color-border)', padding: 8, borderRadius: 4}} value={smartName} placeholder="名称" onChange={(e) => setSmartName(e.target.value)} />
              <select className="searchInput" style={{background: 'var(--color-panel)', border: '1px solid var(--color-border)', padding: 8, borderRadius: 4}} value={smartType} onChange={(e) => setSmartType(e.target.value as 'image' | 'video' | '')}>
                <option value="">类型不限</option>
                <option value="image">图片</option>
                <option value="video">视频</option>
              </select>
              <div className="tagInputWrap">
                <input
                  className="searchInput" style={{background: 'var(--color-panel)', border: '1px solid var(--color-border)', padding: 8, borderRadius: 4}}
                  value={smartTag}
                  placeholder="标签（逗号分隔，精确匹配）"
                  onChange={(e) => setSmartTag(e.target.value)}
                  onFocus={() => {
                    if (smartTagSuggestions.length) setSmartTagSuggestionsOpen(true)
                  }}
                  onBlur={() => {
                    setTimeout(() => setSmartTagSuggestionsOpen(false), 150)
                  }}
                />
                {smartTagSuggestionsOpen && smartTagSuggestions.length ? (
                  <div className="tagSuggest">
                    {smartTagSuggestions.map((t) => (
                      <div
                        key={t.id}
                        className="tagSuggestItem"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          setSmartTag((prev) => replaceLastTagToken(prev, t.name))
                          setSmartTagSuggestionsOpen(false)
                        }}
                      >
                        {t.name}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <input
                className="searchInput" style={{background: 'var(--color-panel)', border: '1px solid var(--color-border)', padding: 8, borderRadius: 4}}
                value={smartRatingGte}
                placeholder="评分≥（0-5）"
                inputMode="numeric"
                onChange={(e) => setSmartRatingGte(e.target.value)}
              />
              <input className="searchInput" style={{background: 'var(--color-panel)', border: '1px solid var(--color-border)', padding: 8, borderRadius: 4}} value={smartTitleContains} placeholder="标题包含" onChange={(e) => setSmartTitleContains(e.target.value)} />
              <div className="modalActions">
                <button className="btn btnSecondary"
                  disabled={busy}
                  onClick={() => {
                    setShowSmartEditor(false)
                    resetSmartForm()
                  }}
                >
                  取消
                </button>
                <button className="btn btnPrimary" disabled={busy} onClick={handleSaveSmartFolder}>
                  {smartEditId ? '更新' : '保存'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showFolderEditor ? (
        <div
          className="modalOverlay"
          onClick={() => {
            setShowFolderEditor(false)
            resetFolderForm()
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">{folderEditId ? '编辑文件夹' : '新建文件夹'}</div>
            <div className="modalBody">
              <input
                className="searchInput"
                style={{ background: 'var(--color-panel)', border: '1px solid var(--color-border)', padding: 8, borderRadius: 4 }}
                value={folderName}
                placeholder="文件夹名称"
                onChange={(e) => setFolderName(e.target.value)}
              />
              <div className="modalActions" style={{ justifyContent: 'space-between' }}>
                <div>
                  {folderEditId ? (
                    <button
                      className="btn btnSecondary"
                      disabled={busy}
                      onClick={() => {
                        if (!folderEditId) return
                        if (!confirm('确认删除该文件夹？文件夹内资源不会被删除。')) return
                        const id = folderEditId
                        setShowFolderEditor(false)
                        resetFolderForm()
                        void handleDeleteFolder(id)
                      }}
                    >
                      删除
                    </button>
                  ) : null}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btnSecondary"
                    disabled={busy}
                    onClick={() => {
                      setShowFolderEditor(false)
                      resetFolderForm()
                    }}
                  >
                    取消
                  </button>
                  <button className="btn btnPrimary" disabled={busy} onClick={() => void handleSaveFolder()}>
                    {folderEditId ? '更新' : '保存'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* AI Settings Modal */}
      {showAiSettings ? (
        <div className="modalOverlay" onClick={() => setShowAiSettings(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">AI 设置（OpenAI-compatible）</div>
            <div className="modalBody">
              <input
                className="searchInput" style={{background: 'var(--color-panel)', border: '1px solid var(--color-border)', padding: 8, borderRadius: 4}}
                value={aiBaseUrl}
                placeholder="Base URL"
                onChange={(e) => setAiBaseUrl(e.target.value)}
              />
              <input className="searchInput" style={{background: 'var(--color-panel)', border: '1px solid var(--color-border)', padding: 8, borderRadius: 4}} value={aiModel} placeholder="Model" onChange={(e) => setAiModel(e.target.value)} />
              <input className="searchInput" style={{background: 'var(--color-panel)', border: '1px solid var(--color-border)', padding: 8, borderRadius: 4}} value={aiApiKey} placeholder="API Key" onChange={(e) => setAiApiKey(e.target.value)} />
              <div className="modalActions">
                <button className="btn btnSecondary" onClick={() => setShowAiSettings(false)}>取消</button>
                <button className="btn btnPrimary" onClick={() => void handleSaveAiSettings()}>保存</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* AI Preview Modal */}
      {showAiPreview ? (
        <div
          className="modalOverlay"
          onClick={() => {
            setShowAiPreview(false)
            setAiPreviewItems([])
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">AI 结果预览</div>
            <div className="modalBody">
              <div className="errorText">确认后才会写入标题/标签；不会删除已有标签。</div>
              <div className="aiPreviewList">
                {aiPreviewItems.map((it) => (
                  <div key={it.id} className="aiPreviewRow">
                    <div className="aiPreviewHead">
                      <div className="aiPreviewFilename">{it.filename}</div>
                    </div>
                    <div className="aiPreviewBody">
                      <div className="aiPreviewLine">
                        <span className="aiPreviewLabel">标题</span>
                        <span className="aiPreviewValue">
                          {(it.beforeTitle || '（空）') + ' → ' + (it.afterTitle || '（空）')}
                        </span>
                      </div>
                      <div className="aiPreviewLine">
                        <span className="aiPreviewLabel">新增标签</span>
                        <span className="aiPreviewValue">{it.addedTags.length ? it.addedTags.join('、') : '（无）'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="modalActions">
                <button className="btn btnSecondary"
                  disabled={aiPhase !== null}
                  onClick={() => {
                    setShowAiPreview(false)
                    setAiPreviewItems([])
                  }}
                >
                  取消
                </button>
                <button className="btn btnPrimary" disabled={aiPhase !== null || !aiPreviewItems.length} onClick={() => void applyAiPreview()}>
                  应用修改
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* AI Loading Modal */}
      {aiPhase ? (
        <div className="modalOverlay">
          <div className="modal">
            <div className="modalTitle">{aiPhase === 'analyzing' ? 'AI 生成中' : 'AI 应用中'}</div>
            <div className="modalBody">
              <div className="aiLoadingRow">
                <div className="aiSpinner" />
                <div className="aiLoadingText">
                  {aiPhase === 'analyzing' ? '正在生成预览' : '正在写入修改'} {aiDone}/{aiTotal}
                </div>
              </div>
              <div className="errorText">处理中请勿关闭应用或切换资源库。</div>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* App Menu */}
      {showAppMenu ? (
        <div className="modalOverlay" onClick={() => setShowAppMenu(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">操作</div>
            <div className="modalBody">
              <div className="sectionTitle">文件</div>
              <div className="modalActions" style={{ justifyContent: 'flex-start' }}>
                <button className="btn btnSecondary"
                  disabled={busy}
                  onClick={() => {
                    setShowAppMenu(false)
                    void handleCreateLibrary()
                  }}
                >
                  创建库…
                </button>
                <button className="btn btnSecondary"
                  disabled={busy}
                  onClick={() => {
                    setShowAppMenu(false)
                    void handleOpenLibrary()
                  }}
                >
                  打开/切换库…
                </button>
                <button className="btn btnSecondary"
                  disabled={busy}
                  onClick={() => {
                    setShowAppMenu(false)
                    void handleImport()
                  }}
                >
                  导入文件…
                </button>
              </div>

              <div className="sectionTitle">AI</div>
              <div className="modalActions" style={{ justifyContent: 'flex-start' }}>
                <button className="btn btnSecondary"
                  disabled={busy || aiPhase !== null || !selectedId}
                  onClick={() => {
                    setShowAppMenu(false)
                    requestAiAutoTag()
                  }}
                >
                  AI 命名/打标签
                </button>
                <button className="btn btnSecondary"
                  disabled={busy || watermarkRemoving || !selectedId || !details?.mime?.startsWith('image/')}
                  onClick={() => {
                    setShowAppMenu(false)
                    void handleRemoveWatermark()
                  }}
                >
                  AI 去水印
                </button>
                <button className="btn btnSecondary"
                  disabled={busy || aiPhase !== null}
                  onClick={() => {
                    setShowAppMenu(false)
                    setShowAiSettings(true)
                  }}
                >
                  AI 设置…
                </button>
              </div>

              <div className="sectionTitle">标签</div>
              <div className="modalActions" style={{ justifyContent: 'flex-start' }}>
                <button className="btn btnSecondary"
                  disabled={busy}
                  onClick={() => {
                    setShowAppMenu(false)
                    void openTagLibrary()
                  }}
                >
                  标签库…
                </button>
              </div>

              <div className="modalActions">
                <button className="btn btnSecondary" onClick={() => setShowAppMenu(false)}>关闭</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Tag Library */}
      {showTagLibrary ? (
        <div
          className="modalOverlay"
          onClick={() => {
            setShowTagLibrary(false)
            setTagLibraryQuery('')
            setTagLibraryItems([])
          }}
        >
          <div className="tagManagerModal" onClick={(e) => e.stopPropagation()}>
            <div className="tagManagerHeader">
              <div className="tagManagerTitle">Tag Library</div>
              <div 
                className="tagManagerClose"
                onClick={() => {
                  setShowTagLibrary(false)
                  setTagLibraryQuery('')
                  setTagLibraryItems([])
                }}
              >
                <IconClose />
              </div>
            </div>
            
            <div className="tagManagerSearch">
              <IconSearch />
              <input
                className="tagManagerSearchInput"
                value={tagLibraryQuery}
                placeholder="Search tags..."
                onChange={(e) => {
                  const v = e.target.value
                  setTagLibraryQuery(v)
                  void loadTagLibrary(v)
                }}
              />
            </div>

            <div className="tagManagerList">
              {tagLibraryItems.map((t) => (
                <div key={t.id} className="tagManagerRow">
                  <div className="tagManagerRowLeft">
                    {tagEditingId === t.id ? (
                      <input 
                        className="tagManagerEditInput"
                        value={tagEditingName} 
                        onChange={(e) => setTagEditingName(e.target.value)} 
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') void handleUpdateTag(t.id, t.name, tagEditingName)
                          if (e.key === 'Escape') setTagEditingId(null)
                        }}
                      />
                    ) : (
                      <>
                        <div className="tagManagerTagName">{t.name}</div>
                        {/* <div className="tagManagerTagCount">12 items</div> */} 
                      </>
                    )}
                  </div>
                  
                  <div className="tagManagerRowRight">
                    {tagEditingId === t.id ? (
                      <>
                        <button className="btnIcon" onClick={() => setTagEditingId(null)} title="Cancel"><IconClose /></button>
                        <button className="btnIcon" onClick={() => void handleUpdateTag(t.id, t.name, tagEditingName)} title="Save">✓</button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="tagManagerActionBtn" 
                          onClick={() => {
                            setTagEditingId(t.id)
                            setTagEditingName(t.name)
                          }}
                        >
                          <IconEdit />
                        </button>
                        <button 
                          className="tagManagerActionBtn" 
                          onClick={() => void handleDeleteTagFromLibrary(t)}
                        >
                          <IconDelete />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="tagManagerDivider" />
            
            <div className="tagManagerFooter">
              <button 
                className="tagManagerCloseBtn" 
                onClick={() => setShowTagLibrary(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {watermarkRemoving ? (
        <div className="modalOverlay">
          <div className="modal">
            <div className="modalTitle">AI 去水印</div>
            <div className="modalBody">
              <div className="aiLoadingRow">
                <div className="aiSpinner" />
                <div className="aiLoadingText">正在处理，请稍候...</div>
              </div>
              <div className="errorText">AI 正在分析并去除水印，处理时间约 30-120 秒，请勿关闭应用。</div>
            </div>
          </div>
        </div>
      ) : null}

      {showImagePreview && details && !details.mime?.startsWith('audio/') && !details.mime?.startsWith('video/') ? (
        <div className="imagePreviewOverlay" onClick={() => setShowImagePreview(false)}>
          <div className="imagePreviewShell" onClick={(e) => e.stopPropagation()}>
            <div className="imagePreviewHeader">
              <div className="imagePreviewTitle">{details.title ?? details.originalFilename}</div>
              <div className="imagePreviewControls">
                {IMAGE_ZOOM_OPTIONS.map((ratio) => (
                  <button
                    key={ratio}
                    className={imageZoom === ratio ? 'imageZoomBtn active' : 'imageZoomBtn'}
                    onClick={() => setImageZoom(ratio)}
                  >
                    {Math.round(ratio * 100)}%
                  </button>
                ))}
                <button className="imagePreviewClose" onClick={() => setShowImagePreview(false)}>
                  关闭
                </button>
              </div>
            </div>
            <div className="imagePreviewViewport">
              <div
                className="imagePreviewCanvas"
                style={{
                  width: `${Math.max(100, imageZoom * 100)}%`,
                  height: `${Math.max(100, imageZoom * 100)}%`
                }}
              >
                <img className="imagePreviewMedia" src={details.originalUrl} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Context Menu */}
      {contextMenu ? (
        <div
          className="contextMenu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={() => setContextMenu(null)}
        >
          <div
            className="contextMenuItem contextMenuItemDanger"
            onClick={() => {
              const ids = [...contextMenu.mediaIds]
              setContextMenu(null)
              void handleDeleteMedia(ids)
            }}
          >
            <IconDelete />
            <span>删除{contextMenu.mediaIds.length > 1 ? ` (${contextMenu.mediaIds.length})` : ''}</span>
          </div>
        </div>
      ) : null}

      {/* Watermark Before/After Preview */}
      {watermarkPreview ? (
        <div className="modalOverlay" onClick={() => setWatermarkPreview(null)}>
          <div className="modal" style={{ width: 700 }} onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">AI 去水印预览</div>
            <div className="modalBody">
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>原图</div>
                  <img src={watermarkPreview.beforeUrl} style={{ width: '100%', borderRadius: 4, border: '1px solid #333' }} />
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>去水印后</div>
                  <img src={watermarkPreview.afterDataUrl} style={{ width: '100%', borderRadius: 4, border: '1px solid #333' }} />
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>确认后将替换原图，此操作不可撤销。</div>
              <div className="modalActions">
                <button className="btn btnSecondary" disabled={busy} onClick={() => setWatermarkPreview(null)}>取消</button>
                <button className="btn btnPrimary" disabled={busy} onClick={() => void handleApplyWatermark()}>确认替换</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Toast */}
      {toastMessage ? (
        <div className="toast" onClick={() => setToastMessage(null)}>
          {toastMessage}
        </div>
      ) : null}

      {error ? (
        <div className="modalOverlay" onClick={() => setError(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">发生错误</div>
            <div className="modalBody">
              <div className="errorText">{error}</div>
              <div className="modalActions">
                <button className="btn btnSecondary" onClick={() => setError(null)}>关闭</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
