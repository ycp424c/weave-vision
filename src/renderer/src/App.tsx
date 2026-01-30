import { useEffect, useMemo, useState } from 'react'

// --- Icons ---
const IconLibrary = () => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
  </svg>
)
const IconFolder = () => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
  </svg>
)
const IconSmart = () => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2.06 11L15 15.28 12.06 17l.78-3.33-2.59-2.24 3.41-.29L15 8l1.34 3.14 3.41.29-2.59 2.24.78 3.33z" />
  </svg>
)
const IconTag = () => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z" />
  </svg>
)
const IconSettings = () => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
)
const IconSearch = () => (
  <svg className="searchIcon" viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
)
const IconAi = () => (
  <svg className="btnIcon" viewBox="0 0 24 24">
    <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
  </svg>
)
const IconAdd = () => (
  <svg className="btnIcon" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
)
const IconMenu = () => (
  <svg className="btnIcon" viewBox="0 0 24 24">
     <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
)
const IconClose = () => (
  <svg className="navIcon" viewBox="0 0 24 24" style={{ width: 24, height: 24 }}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
)
const IconEdit = () => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
)
const IconDelete = () => (
  <svg className="navIcon" viewBox="0 0 24 24">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
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
  rating: number
  tags: Array<{ id: string; name: string; source: string; confidence: number | null }>
  sources: string[]
}
type TagRow = { id: string; name: string }
type SmartFolderRow = { id: string; name: string; ruleJson: string }
type DuplicateGroupRow = { media: MediaRow; sourceCount: number }
type AiSuggestion = { title: string; tags: string[] }

type View = 'all' | 'images' | 'videos' | 'smart' | 'duplicates'

function App(): React.JSX.Element {
  const api = (window as unknown as { api?: typeof window.api }).api
  const [status, setStatus] = useState<LibraryStatus | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>('all')
  const [smartFolders, setSmartFolders] = useState<SmartFolderRow[]>([])
  const [activeSmartId, setActiveSmartId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [items, setItems] = useState<MediaRow[]>([])
  const [duplicates, setDuplicates] = useState<DuplicateGroupRow[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selection, setSelection] = useState<string[]>([])
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
  const [dragActive, setDragActive] = useState(false)
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

  const libraryPath = useMemo(() => status?.libraryPath ?? null, [status])

  const loadSmartFolders = async (): Promise<void> => {
    if (!api) return
    const list = await api.smartFolders.list()
    setSmartFolders(list)
  }

  const loadContent = async (): Promise<void> => {
    if (!api) return
    if (!status?.open) return
    if (view === 'duplicates') {
      const list = await api.duplicates.list(500, 0)
      setDuplicates(list)
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
      setItems(list)
      return
    }
    const mimePrefix = view === 'images' ? 'image' : view === 'videos' ? 'video' : null
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
      setDragActive(true)
    }

    const onDragLeave = (e: DragEvent): void => {
      e.preventDefault()
      setDragActive(false)
    }

    const onDrop = (e: DragEvent): void => {
      if (!e.dataTransfer) return
      if (!Array.from(e.dataTransfer.types).includes('Files')) return
      e.preventDefault()
      setDragActive(false)
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
  }, [status?.open, view, activeSmartId, query, tagFilter])

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
    setDetails(null)
  }, [view, activeSmartId])

  useEffect(() => {
    void (async () => {
      if (!api) return
      if (!selectedId) {
        setDetails(null)
        return
      }
      const d = await api.media.getDetails(selectedId)
      setDetails(d)
    })()
  }, [selectedId])

  const formatError = (e: unknown): string => {
    if (e instanceof Error) return e.message
    return String(e)
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
      setView('all')
      setActiveSmartId(null)
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
      setView('all')
      setActiveSmartId(null)
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
      await api.media.importFiles(files)
      await loadContent()
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

  const handleSelectSmart = (id: string): void => {
    setView('smart')
    setActiveSmartId(id)
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

  const toggleSelect = (id: string, additive: boolean): void => {
    if (!additive) {
      setSelection([id])
      setSelectedId(id)
      return
    }
    setSelection((prev) => {
      const exists = prev.includes(id)
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id]
      const primary = next[0] ?? null
      setSelectedId(primary)
      return next
    })
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

  const requestDeleteSmartFolder = (sf: SmartFolderRow): void => {
    setSmartDeleteTarget(sf)
    setShowSmartDeleteConfirm(true)
  }

  const handleSaveMeta = async (patch: { title?: string | null; note?: string | null; rating?: number }): Promise<void> => {
    if (!details) return
    if (!api) return
    try {
      const updated = await api.media.setMeta(details.id, patch)
      if (updated) setDetails(updated)
      await loadContent()
    } catch (e) {
      setError(formatError(e))
    }
  }

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
          <div className="sectionTitle">LIBRARIES</div>
          <div className={view === 'all' ? 'nav active' : 'nav'} onClick={() => setView('all')}>
            <IconLibrary />
            <span>My Resource Library</span>
          </div>

          <div className="sectionTitle">SMART FOLDERS</div>
          <div className={view === 'images' ? 'nav active' : 'nav'} onClick={() => setView('images')}>
             <IconFolder />
            <span>Images</span>
          </div>
          <div className={view === 'videos' ? 'nav active' : 'nav'} onClick={() => setView('videos')}>
             <IconFolder />
            <span>Videos</span>
          </div>
          <div className={view === 'duplicates' ? 'nav active' : 'nav'} onClick={() => setView('duplicates')}>
             <IconFolder />
            <span>Duplicates</span>
          </div>

          {smartFolders.map((sf) => (
             <div key={sf.id} className={view === 'smart' && activeSmartId === sf.id ? 'nav active' : 'nav'} onClick={() => handleSelectSmart(sf.id)}>
                <IconSmart />
                <span style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{sf.name}</span>
                <button className="btnIcon" style={{opacity: 0.5}} onClick={(e) => { e.stopPropagation(); startEditSmartFolder(sf); }}>✎</button>
             </div>
          ))}
          <div className="nav" onClick={() => openSmartEditorForCreate()}>
            <IconAdd />
            <span>New Smart Folder</span>
          </div>

          <div className="sectionTitle">TAGS</div>
          <div className="nav" onClick={() => openTagLibrary()}>
            <IconTag />
            <span>Manage Tags</span>
          </div>

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
                    return (
                        <div
                            key={m.id}
                            className={isSelected ? 'item selected' : 'item'}
                            onClick={(e) => toggleSelect(m.id, e.metaKey || e.ctrlKey)}
                        >
                            {m.thumbUrl ? <img className="thumb" src={m.thumbUrl} /> : <div className="thumb placeholder" />}
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
                    <div className="preview">
                        {details.mime?.startsWith('video/') ? (
                        <video className="previewMedia" src={details.originalUrl} controls />
                        ) : (
                        <img className="previewMedia" src={details.originalUrl} />
                        )}
                    </div>
                    
                    <div className="infoSection">
                        <div className="detailTitle">{details.title ?? details.originalFilename}</div>
                        <div className="propsGrid">
                             <div className="propRow">
                                <span className="propLabel">Size</span>
                                <span className="propValue">-</span>
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

                    <button className="aiActionBtn" disabled={busy || aiPhase !== null} onClick={requestAiAutoTag}>
                        <IconAi />
                        <span>AI Analyze & Tag</span>
                    </button>
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
