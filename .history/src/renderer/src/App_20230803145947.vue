<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable vue/return-in-computed-property -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import TitleBar from './components/TitleBar.vue'
import Player from './components/Player.vue'
import Playlist from './components/Playlist.vue'
import useIpcRendererOn from './hook/useIpcRendererOn'
import { getVideoInfoList } from './utils/video'

import { VideoFile, VideoInfo } from '../../common/types'
import { IpcEvents } from '../../common/ipcEvents'
import srtParser2 from 'srt-parser-2'
import { darkTheme } from 'naive-ui'

import Grammar from './components/Grammar.vue'

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

// 字幕数组
const srtArray = ref([])

// 字幕语法json数组
const jsonArray = ref([])

useIpcRendererOn(IpcEvents.EV_GET_SUBTITLE_REPLY, (e, data) => {
  const parser = new srtParser2()

  jsonArray.value = JSON.parse(data.json)

  srtArray.value = parser.fromSrt(data.subtitle).map((item, index) => {
    return {
      ...item,
      id: 'sub' + index,
    }
  })


  // 获得所有的日文字幕
  // let subtilteJsonArr = []
  // subtilteJsonArr = srtArray.value.filter(item => check_is_jp(item.text)).map(item => item.text)

})

const grammar = ref('')

</script>

<template>
  <n-config-provider :theme="darkTheme" style="height: 100%; width: 100%">
    <TitleBar :title="videoName" @toggle-playlist="togglePlaylist"></TitleBar>
    <div class="main" style="display: grid; height: 100%; width: 100%">
      <div class="player-item">
        <Player ref="player" style="height: 100%"></Player>
      </div>

      <div class="grammar-item">
        <Grammar v-if="grammar" :grammar="grammar"></Grammar>
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
    'subtitle player'
    'grammar  grammar';
  grid-template-rows: 50vh 1fr;
  grid-template-columns: 50% 1fr;

  .header-item {
    grid-area: header;
  }

  .player-item {
    grid-area: player;
  }

  .grammar-item {
    grid-area: grammar;
  }
}
</style>
