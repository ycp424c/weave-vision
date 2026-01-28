import { useEffect, useMemo, useState } from 'react'

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
        <header className="topbar">
          <div className="title">作品资源管理</div>
          <div className="path" />
          <div className="actions" />
        </header>
        <main className="center">
          <div className="card">
            <div className="cardTitle">请在 Electron 窗口中运行</div>
            <div className="cardActions">
              <button onClick={() => location.reload()}>刷新</button>
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
          <div className="title">作品资源管理</div>
          <div className="path" />
          <div className="actions" />
        </header>
        <main className="center">
          <div className="card">
            <div className="cardTitle">选择或创建资源库</div>
            <div className="cardActions">
              <button disabled={busy} onClick={handleCreateLibrary}>
                创建库
              </button>
              <button disabled={busy} onClick={handleOpenLibrary}>
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
      <header className="topbar">
        <div className="title">作品资源管理</div>
        <div className="path" title={libraryPath ?? ''}>
          {libraryPath}
        </div>
        <div className="actions">
          <input className="search" value={query} placeholder="搜索标题/备注" onChange={(e) => setQuery(e.target.value)} />
          <input
            className="search"
            value={tagFilter}
            placeholder="按标签过滤（精确匹配）"
            onChange={(e) => setTagFilter(e.target.value)}
          />
          <button disabled={busy} onClick={() => setShowAppMenu(true)}>
            操作
          </button>
        </div>
      </header>
      <main className="layout">
        <aside className="sidebar">
          <div className="navSection">
            <button className={view === 'all' ? 'nav active' : 'nav'} onClick={() => setView('all')}>
              全部
            </button>
            <button className={view === 'images' ? 'nav active' : 'nav'} onClick={() => setView('images')}>
              图片
            </button>
            <button className={view === 'videos' ? 'nav active' : 'nav'} onClick={() => setView('videos')}>
              视频
            </button>
            <button className={view === 'duplicates' ? 'nav active' : 'nav'} onClick={() => setView('duplicates')}>
              重复
            </button>
          </div>
          <div className="navSection">
            <div className="sectionTitle">智能文件夹</div>
            <button
              className={view === 'smart' && !activeSmartId ? 'nav active' : 'nav'}
              onClick={() => {
                setView('smart')
                setActiveSmartId(null)
                setSelectedId(null)
              }}
            >
              查看全部
            </button>
            {smartFolders.map((sf) => (
              <div key={sf.id} className={view === 'smart' && activeSmartId === sf.id ? 'navRow active' : 'navRow'}>
                <button className="navRowMain" onClick={() => handleSelectSmart(sf.id)}>
                  {sf.name}
                </button>
                <div className="navRowActions">
                  <button
                    className="navIconBtn"
                    disabled={busy}
                    onClick={() => {
                      startEditSmartFolder(sf)
                    }}
                    title="编辑"
                  >
                    编辑
                  </button>
                  <button
                    className="navIconBtn danger"
                    disabled={busy}
                    onClick={() => {
                      requestDeleteSmartFolder(sf)
                    }}
                    title="删除"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
            <button
              className="nav navNew"
              onClick={() => {
                openSmartEditorForCreate()
              }}
            >
              ＋ 新建
            </button>
          </div>
        </aside>

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
                  <label
                    className="itemCheck"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(m.id, true)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </label>
                  {m.thumbUrl ? <img className="thumb" src={m.thumbUrl} /> : <div className="thumb placeholder" />}
                  <div className="caption" title={m.title ?? m.originalFilename}>
                    {view === 'duplicates' ? `${m.title ?? m.originalFilename}（${count}）` : m.title ?? m.originalFilename}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <aside className="inspector">
          {details ? (
            <div className="inspectorInner">
              <div className="selectionInfo">{selection.length ? `已选择 ${selection.length} 项` : '已选择 1 项'}</div>
              <div className="preview">
                {details.mime?.startsWith('video/') ? (
                  <video className="previewMedia" src={details.originalUrl} controls />
                ) : (
                  <img className="previewMedia" src={details.originalUrl} />
                )}
              </div>
              <div className="field">
                <div className="label">标题</div>
                <input
                  value={details.title ?? ''}
                  onChange={(e) => setDetails({ ...details, title: e.target.value })}
                  onBlur={() => void handleSaveMeta({ title: details.title })}
                />
              </div>
              <div className="field">
                <div className="label">评分</div>
                <input
                  value={String(details.rating)}
                  inputMode="numeric"
                  onChange={(e) => setDetails({ ...details, rating: Number(e.target.value || 0) })}
                  onBlur={() => void handleSaveMeta({ rating: details.rating })}
                />
              </div>
              <div className="field">
                <div className="label">备注</div>
                <textarea
                  value={details.note ?? ''}
                  onChange={(e) => setDetails({ ...details, note: e.target.value })}
                  onBlur={() => void handleSaveMeta({ note: details.note })}
                />
              </div>
              <div className="field">
                <div className="label">标签</div>
                <div className="tagList">
                  {details.tags.map((t) => (
                    <span key={t.id} className="tag">
                      {t.name}
                      <button className="tagRemove" onClick={() => void handleRemoveTag(t.id)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="tagAdd">
                  <div className="tagInputWrap">
                    <input
                      value={tagInput}
                      placeholder="输入标签，逗号分隔；回车添加"
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
                  <button onClick={() => void handleAddTags()}>添加</button>
                </div>
              </div>
              <div className="field">
                <div className="label">来源</div>
                <div className="sources">
                  {details.sources.slice(0, 20).map((s) => (
                    <div key={s} className="source">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="inspectorEmpty">选择一个资源查看详情</div>
          )}
        </aside>
      </main>
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
                <button
                  disabled={busy}
                  onClick={() => {
                    setShowSmartDeleteConfirm(false)
                    setSmartDeleteTarget(null)
                  }}
                >
                  取消
                </button>
                <button
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
              <input value={smartName} placeholder="名称" onChange={(e) => setSmartName(e.target.value)} />
              <select value={smartType} onChange={(e) => setSmartType(e.target.value as 'image' | 'video' | '')}>
                <option value="">类型不限</option>
                <option value="image">图片</option>
                <option value="video">视频</option>
              </select>
              <div className="tagInputWrap">
                <input
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
                value={smartRatingGte}
                placeholder="评分≥（0-5）"
                inputMode="numeric"
                onChange={(e) => setSmartRatingGte(e.target.value)}
              />
              <input value={smartTitleContains} placeholder="标题包含" onChange={(e) => setSmartTitleContains(e.target.value)} />
              <div className="modalActions">
                <button
                  disabled={busy}
                  onClick={() => {
                    setShowSmartEditor(false)
                    resetSmartForm()
                  }}
                >
                  取消
                </button>
                <button disabled={busy} onClick={handleSaveSmartFolder}>
                  {smartEditId ? '更新' : '保存'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showAiSettings ? (
        <div className="modalOverlay" onClick={() => setShowAiSettings(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">AI 设置（OpenAI-compatible）</div>
            <div className="modalBody">
              <input
                value={aiBaseUrl}
                placeholder="Base URL，例如 http://localhost:8000 或 https://dashscope.aliyuncs.com/compatible-mode"
                onChange={(e) => setAiBaseUrl(e.target.value)}
              />
              <input value={aiModel} placeholder="Model，例如 Qwen2-VL-7B-Instruct" onChange={(e) => setAiModel(e.target.value)} />
              <input value={aiApiKey} placeholder="API Key" onChange={(e) => setAiApiKey(e.target.value)} />
              <div className="modalActions">
                <button onClick={() => setShowAiSettings(false)}>取消</button>
                <button onClick={() => void handleSaveAiSettings()}>保存</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
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
                <button
                  disabled={aiPhase !== null}
                  onClick={() => {
                    setShowAiPreview(false)
                    setAiPreviewItems([])
                  }}
                >
                  取消
                </button>
                <button disabled={aiPhase !== null || !aiPreviewItems.length} onClick={() => void applyAiPreview()}>
                  应用修改
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
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
      {dragActive ? (
        <div className="dropOverlay">
          <div className="dropCard">松开鼠标导入文件</div>
        </div>
      ) : null}
      {showAppMenu ? (
        <div className="modalOverlay" onClick={() => setShowAppMenu(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">操作</div>
            <div className="modalBody">
              <div className="sectionTitle">文件</div>
              <div className="modalActions" style={{ justifyContent: 'flex-start' }}>
                <button
                  disabled={busy}
                  onClick={() => {
                    setShowAppMenu(false)
                    void handleCreateLibrary()
                  }}
                >
                  创建库…
                </button>
                <button
                  disabled={busy}
                  onClick={() => {
                    setShowAppMenu(false)
                    void handleOpenLibrary()
                  }}
                >
                  打开/切换库…
                </button>
                <button
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
                <button
                  disabled={busy || aiPhase !== null || !selectedId}
                  onClick={() => {
                    setShowAppMenu(false)
                    requestAiAutoTag()
                  }}
                >
                  AI 命名/打标签
                </button>
                <button
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
                <button
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
                <button onClick={() => setShowAppMenu(false)}>关闭</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showTagLibrary ? (
        <div
          className="modalOverlay"
          onClick={() => {
            setShowTagLibrary(false)
            setTagLibraryQuery('')
            setTagLibraryItems([])
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">标签库</div>
            <div className="modalBody">
              <input
                value={tagLibraryQuery}
                placeholder="搜索标签"
                onChange={(e) => {
                  const v = e.target.value
                  setTagLibraryQuery(v)
                  void loadTagLibrary(v)
                }}
              />
              <div className="tagLibraryList">
                {tagLibraryItems.map((t) => (
                  <div key={t.id} className="tagLibraryRow">
                    <div className="tagLibraryName">
                      {tagEditingId === t.id ? (
                        <input value={tagEditingName} onChange={(e) => setTagEditingName(e.target.value)} />
                      ) : (
                        t.name
                      )}
                    </div>
                    <div className="tagLibraryActions">
                      {tagEditingId === t.id ? (
                        <>
                          <button disabled={busy} onClick={() => setTagEditingId(null)}>
                            取消
                          </button>
                          <button disabled={busy} onClick={() => void handleUpdateTag(t.id, t.name, tagEditingName)}>
                            保存
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            disabled={busy}
                            onClick={() => {
                              setTagFilter(t.name)
                              setShowTagLibrary(false)
                            }}
                          >
                            过滤
                          </button>
                          <button disabled={busy || !selectedId} onClick={() => void addTagsToSelection([t.name])}>
                            添加到选中
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => {
                              setTagEditingId(t.id)
                              setTagEditingName(t.name)
                            }}
                          >
                            编辑
                          </button>
                          <button disabled={busy} onClick={() => void handleDeleteTagFromLibrary(t)}>
                            删除
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modalActions">
                <button onClick={() => setShowTagLibrary(false)}>关闭</button>
              </div>
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
                <button onClick={() => setError(null)}>关闭</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
