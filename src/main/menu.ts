import { Menu, type MenuItemConstructorOptions, app } from 'electron'
import type { BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'

export type MenuAction =
  | 'library:create'
  | 'library:open'
  | 'media:import'
  | 'ai:settings'
  | 'ai:autoTag'
  | 'tags:library'

export function registerAppMenu(mainWindow: BrowserWindow): void {
  const send = (action: MenuAction): void => {
    mainWindow.webContents.send('menu:action', action)
  }

  const template: MenuItemConstructorOptions[] = [
    ...(process.platform === 'darwin'
      ? ([
          {
            label: app.name,
            submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'services' }, { type: 'separator' }, { role: 'quit' }]
          }
        ] satisfies MenuItemConstructorOptions[])
      : []),
    {
      label: '文件',
      submenu: [
        { label: '创建库…', accelerator: 'CmdOrCtrl+N', click: () => send('library:create') },
        { label: '打开/切换库…', accelerator: 'CmdOrCtrl+O', click: () => send('library:open') },
        { type: 'separator' },
        { label: '导入文件…', accelerator: 'CmdOrCtrl+I', click: () => send('media:import') },
        { type: 'separator' },
        ...(process.platform === 'darwin' ? [] : ([{ role: 'quit' }] satisfies MenuItemConstructorOptions[]))
      ]
    },
    {
      label: 'AI',
      submenu: [
        { label: 'AI 命名/打标签', accelerator: 'CmdOrCtrl+K', click: () => send('ai:autoTag') },
        { label: 'AI 设置…', click: () => send('ai:settings') }
      ]
    },
    {
      label: '标签',
      submenu: [{ label: '标签库…', accelerator: 'CmdOrCtrl+L', click: () => send('tags:library') }]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload' },
        ...(is.dev ? ([( { role: 'toggleDevTools' } )] satisfies MenuItemConstructorOptions[]) : [])
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

