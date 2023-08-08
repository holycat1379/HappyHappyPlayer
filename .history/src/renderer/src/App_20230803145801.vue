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

const currentItem = ref('')
const grammar = ref('')

// 检查是否为日文
function check_is_jp(text) {
  const reg = /[\u0800-\u4e00]+/
  return reg.test(text)
}

const preElement = ref()

// 监听当前播放时间
watch(() => player.value?.currentStartSeconds, () => {

  const resultArray = []
  srtArray.value.forEach((item, index) => {

    // 如果是最后一个 则下一个开始时间为0 也就是视频结束时间
    let nextStartSeconds = srtArray.value[index + 1] ? srtArray.value[index + 1].startSeconds : 0

    // 如果两者相等说明存在同样两个的时间 就需要判断下一个的下一个时间
    if (nextStartSeconds === item.startSeconds && srtArray.value[index + 2]) {
      nextStartSeconds = srtArray.value[index + 2].startSeconds
    }

    // 如果当前时间大于等于当前字幕开始时间 并且小于下一个字幕开始时间 则说明当前字幕正在播放
    if (player.value?.currentStartSeconds >= item.startSeconds && player.value?.currentStartSeconds < nextStartSeconds) {
      resultArray.push(item)
    }
  })

  // 如果有多个字幕正在播放 则优先选择日文字幕
  if (resultArray.length > 1) {
    resultArray.forEach(item => {
      if (check_is_jp(item.text)) {
        currentItem.value = item
      }
    })
  } else {
    currentItem.value = resultArray[0]
  }
  // 如果当前字幕为空 则不做任何操作
  if (!currentItem.value) {
    return
  }

  // 获取当前字幕对应的元素
  const element = document.getElementById(currentItem.value.id);

  // 如果当前元素和上一个元素相同 则不做任何操作
  if (element === preElement.value) {
    return
  }

  // 如果当前元素存在 则将当前元素滚动到中间
  if (element) {
    grammar.value = jsonArray.value.find(item => {
      return item['原句'] === currentItem.value.text
    })

    // 如果上一个元素存在 则将上一个元素的样式还原
    if (preElement.value) {
      preElement.value.style.color = '#fff'
      preElement.value.style.fontSize = '18px'
      preElement.value.style.margin = '0 0'

    }

    // 将当前元素的样式修改
    element.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
    element.style.color = '#18a058'
    element.style.fontSize = '22px'
    element.style.margin = '10px 0'


    preElement.value = element
  }


})


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
