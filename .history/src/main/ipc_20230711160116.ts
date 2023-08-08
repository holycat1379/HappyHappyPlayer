import { BrowserWindow, dialog, ipcMain } from 'electron'
import { VideoFile, VideoInfo } from '../common/types'
import { getVideoExtensions, getVideoFromPath } from './utils'
import { setMacOSRecentDocuments, setWindowJumpList } from './history'

import { IpcEvents } from '../common/ipcEvents'
import fs from 'fs'
import { saveBase64Image } from './fs'
import { store } from './store'

const register = (): void => {
  ipcMain.on(IpcEvents.EV_SHOW_OPEN_DIALOG, async (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    win!.focus()
    dialog
      .showOpenDialog(win!, {
        title: 'Select Videos',
        properties: ['openFile', 'multiSelections'],
        filters: [{ extensions: getVideoExtensions(false), name: 'Video' }]
      })
      .then((re) => {
        if (!re.canceled) {
          const videoFiles: VideoFile[] = []
          re.filePaths.forEach((p) => {
            const file = getVideoFromPath(p)
            if (file) videoFiles.push(file)
          })
          e.sender.send(IpcEvents.EV_PLAY, videoFiles)
        }
      })
  })
  function check_is_jp(text){
    const reg = /[\u0800-\u4e00]+/
    return reg.test(text)
  }
  
  ipcMain.on(IpcEvents.EV_GET_SUBTITLE, (e, subtitlePath: string) => {
    if (fs.existsSync(subtitlePath + '.srt')) {
      const subtitle =  fs.readFileSync(subtitlePath + '.srt', { encoding: 'utf-8' })
      const json =  fs.readFileSync(subtitlePath + '.json', { encoding: 'utf-8' })

    


      e.reply(IpcEvents.EV_GET_SUBTITLE_REPLY, {subtitle,json})
    }

  })
  ipcMain.on(IpcEvents.EV_ADD_VIDEOS, (e, videos: VideoInfo[]) => {
    const paths = videos.map((v) => v.path)
    let list = store.get('playlist')
    list = list.filter((v) => !paths.includes(v.path))
    list = videos.concat(list)

    videos.forEach((v) => {
      const savePath = saveBase64Image(v.poster)
      v.poster = savePath
    })

    if (list.length > 10) list = list.slice(0, 10)
    store.set('playlist', list)

    setWindowJumpList(list)
    setMacOSRecentDocuments(list)

    e.reply(IpcEvents.EV_ADD_VIDEOS, list)
  })

  ipcMain.handle(IpcEvents.EV_GET_PLAYLIST, () => {
    return store.get('playlist')
  })
}

export default { register }
