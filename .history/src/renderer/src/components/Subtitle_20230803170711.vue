<template>
  <div class="subtitle-item">
    <div v-for="(subtitle, index) in currentItemArray" :key="index" v-html="subtitle.text"></div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'srt-parser-2'
import Player from './components/Player.vue'
import { reactive, watch } from 'vue'

const props = defineProps<{ srtList: Line[]; player: InstanceType<typeof Player> }>()

const currentItemArray = reactive<Line[]>([])

// Get current subtitle item by current time
watch(
  () => props.player?.currentStartSeconds,
  () => {
    currentItemArray.length = 0
    props.srtList.forEach((item, index) => {
      // 如果是最后一个 则下一个开始时间为0 也就是视频结束时间
      let nextStartSeconds = props.srtList[index + 1] ? props.srtList[index + 1].startSeconds : 0

      // 如果两者相等说明存在同样两个的时间 就需要判断下一个的下一个时间
      if (nextStartSeconds === item.startSeconds && props.srtList[index + 2]) {
        nextStartSeconds = props.srtList[index + 2].startSeconds
      }

      // 如果当前时间大于等于当前字幕开始时间 并且小于下一个字幕开始时间 则说明当前字幕正在播放
      if (
        props.player?.currentStartSeconds >= item.startSeconds &&
        props.player?.currentStartSeconds < nextStartSeconds
      ) {
        item.text = item.text.replace(/\n/g, '<br/>')
        currentItemArray.push(item)
      }
    })
  }
)
</script>

<style scoped></style>
