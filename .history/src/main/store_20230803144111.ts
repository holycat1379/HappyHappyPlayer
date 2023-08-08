import Store, { Schema } from 'electron-store'

import { VideoInfo } from '../common/types'

interface Entity {
  playlist: VideoInfo[]
}

const schema: Schema<Entity> = {
  playlist: {
    type: 'array',
    default: []
  }
}
// clear the store
const clearStore = (): void => {
  store.clear()
}
export const store = new Store<Entity>({ schema })
