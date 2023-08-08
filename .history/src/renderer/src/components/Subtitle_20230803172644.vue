<template>
  <div class="subtitle-item">
    {{ subtitle }}
  </div>
</template>

<script setup lang="ts">
import { Line } from 'srt-parser-2'
import Player from './components/Player.vue'
import { reactive, ref, watch } from 'vue'

interface Options {
  currentItemShowIndexList: number[]
}

const props = defineProps<{
  srtList: Line[]
  player: InstanceType<typeof Player>
  options: Options
}>()

const currentItemArray = reactive<Line[]>([])

const subtitle = ref('')
watch(
  () => props.player?.currentStartSeconds,
  () => {
    currentItemArray.length = 0
    const currentStartSeconds = props.player.currentStartSeconds
    for (let i = 0; i < props.srtList.length; i++) {
      const currentSrtItem = props.srtList[i]
      const nextSrtItem = props.srtList[i + 1]
      if (
        currentStartSeconds >= currentSrtItem.startSeconds &&
        (!nextSrtItem || currentStartSeconds < nextSrtItem.startSeconds)
      ) {
        currentItemArray.push(currentSrtItem)
        if (nextSrtItem) {
          currentItemArray.push(nextSrtItem)
        }
        break
      }
    }
    subtitle.value = currentItemArray[0].text + currentItemArray[1]?.text || ''
    subtitle.value = subtitle.value.replace(/\n/g, '')
  }
)

// Get current subtitle item by current time
// watch(
//   () => props.player?.currentStartSeconds,
//   () => {
//     currentItemArray.length = 0
//     props.srtList.forEach((item, index) => {
//       // 如果是最后一个 则下一个开始时间为0 也就是视频结束时间
//       let nextStartSeconds = props.srtList[index + 1] ? props.srtList[index + 1].startSeconds : 0
//
//       // 如果两者相等说明存在同样两个的时间 就需要判断下一个的下一个时间
//       if (nextStartSeconds === item.startSeconds && props.srtList[index + 2]) {
//         nextStartSeconds = props.srtList[index + 2].startSeconds
//       }
//
//       // 如果当前时间大于等于当前字幕开始时间 并且小于下一个字幕开始时间 则说明当前字幕正在播放
//       if (
//         props.player?.currentStartSeconds >= item.startSeconds &&
//         props.player?.currentStartSeconds < nextStartSeconds
//       ) {
//         item.text = item.text.replace(/\n/g, '<br/>')
//         currentItemArray.push(item)
//       }
//     })
//   }
// )
</script>

<style scoped></style>
