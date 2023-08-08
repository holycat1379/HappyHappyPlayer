<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable vue/return-in-computed-property -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import TitleBar from './components/TitleBar.vue'
import Player from './components/Player.vue'
import Playlist from './components/Playlist.vue'
import Subtitle from './components/Subtitle.vue'

import useIpcRendererOn from './hook/useIpcRendererOn'
import { getVideoInfoList } from './utils/video'

import { VideoFile, VideoInfo } from '../../common/types'
import { IpcEvents } from '../../common/ipcEvents'
import srtParser2, { Line } from 'srt-parser-2'
import { darkTheme } from 'naive-ui'


const player = ref<InstanceType<typeof Player> | null>(null)
const playlist = ref<InstanceType<typeof Playlist> | null>(null)
const videoName = ref<string>('')

const togglePlaylist = (): void => {
  playlist.value?.toggle()
}

const playVideo = (video: VideoInfo): void => {
  videoName.value = video.name
  player.value?.play(video)
}

useIpcRendererOn(IpcEvents.EV_PLAY, async (_, videos: VideoFile[]) => {
  const videoInfoList = await getVideoInfoList(videos)
  window.electron.ipcRenderer.send(IpcEvents.EV_ADD_VIDEOS, videoInfoList)
})

useIpcRendererOn(IpcEvents.EV_PAUSE, () => {
  player.value?.pause()
})


const srtList = ref<Line[]>([])


const grammarList = ref([])

useIpcRendererOn(IpcEvents.EV_GET_SUBTITLE_REPLY, (e, data) => {
  console.log(data)

  const parser = new srtParser2()
  console.log(data)

  console.log(JSON.parse(data.subtitle))
  srtList.value = parser.fromSrt(data.subtitle).map((item, index) => {
    return {
      ...item,
      id: 'sub' + index,
    }
  })
})


</script>

<template>
  <n-config-provider :theme="darkTheme" style="height: 100%; width: 100%">
    <TitleBar :title="videoName" @toggle-playlist="togglePlaylist"></TitleBar>
    <div class="main" style="display: grid; height: 100%; width: 100%">
      <div class="player-item">
        <Player ref="player" style="height: 100%"></Player>
      </div>
      <div class="subtitle-item">
        <Subtitle :player="player" :srt-list="srtList"></Subtitle>
      </div>
    </div>
    <Playlist ref="playlist" @click="playVideo"></Playlist>
  </n-config-provider>
</template>

<style lang="less">
@import './assets/css/styles.less';
@import './assets/font/codicon.less';

.main {
  grid-template-areas:
    'player'
    'subtitle';
  grid-template-rows: 70vh 1fr;
  grid-template-columns: 100%;

  .player-item {
    grid-area: player;
  }

  .subtitle-item {
    grid-area: subtitle;
  }
}
</style>
