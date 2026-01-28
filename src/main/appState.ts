import { app } from 'electron'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { LibraryManager } from './library/libraryManager'

type AppState = {
  lastLibraryPath: string | null
}

const DEFAULT_STATE: AppState = { lastLibraryPath: null }

function getStateFilePath(): string {
  return path.join(app.getPath('userData'), 'state.json')
}

async function readState(): Promise<AppState> {
  try {
    const text = await readFile(getStateFilePath(), 'utf-8')
    const parsed = JSON.parse(text) as unknown
    const obj = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
    const lastLibraryPath = typeof obj?.lastLibraryPath === 'string' ? obj.lastLibraryPath : null
    return { lastLibraryPath }
  } catch {
    return DEFAULT_STATE
  }
}

async function writeState(state: AppState): Promise<void> {
  await writeFile(getStateFilePath(), JSON.stringify(state, null, 2), 'utf-8')
}

export async function setLastLibraryPath(libraryPath: string | null): Promise<void> {
  const prev = await readState()
  await writeState({ ...prev, lastLibraryPath: libraryPath })
}

export async function restoreLastLibraryIfPossible(libraryManager: LibraryManager): Promise<void> {
  const state = await readState()
  if (!state.lastLibraryPath) return
  try {
    await libraryManager.openLibrary(state.lastLibraryPath)
  } catch (e) {
    await setLastLibraryPath(null)
    console.warn('[restoreLastLibraryIfPossible] failed, cleared lastLibraryPath:', e)
  }
}

