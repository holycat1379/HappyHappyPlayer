<template>
  <div class="subtitle-item pt-10">
    <p class="text-2xl text-center">{{ subtitle.text }}</p>
    <div
      class="ch-box h-10 text-2xl w-auto bg-dark-50 text-center"
      @mouseover="hovering = true"
      @mouseout="hovering = false"
    >
      {{ hovering ? subtitle.ch : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'srt-parser-2'
import Player from './components/Player.vue'
import { watchEffect, ref, watch } from 'vue'

interface Options {
  currentItemShowIndexList: number[]
}
const hovering = ref<boolean>(false)
const props = defineProps<{
  srtList: Line[]
  player: InstanceType<typeof Player>
  // options: Options
}>()

const handledSrtList = ref<Line[]>([])
watchEffect(() => {
  handledSrtList.value = youtubeModeSrtHandle(props.srtList)
})

watchEffect(() => {
  // 判断当前视频是否暂停

  // if(props.player.value) {
  //   console.log(props.player.value)
  // }
})

// 


// 将srtList的第1个和第2个合并为一个字幕，第3个和第4个合并为一个字幕，以此类推
function youtubeModeSrtHandle(srtList: Line[]): Line[] {
  const mergedSrtList: Line[] = []
  for (let i = 0; i < srtList.length; i += 2) {
    const currentSrtItem = srtList[i]
    const nextSrtItem = srtList[i + 1]
    if (nextSrtItem) {
      const mergedSrtItem = {
        startSeconds: currentSrtItem.startSeconds,
        endSeconds: nextSrtItem.endSeconds,
        text: `${currentSrtItem.text}\n${nextSrtItem.text}`
      }
      mergedSrtList.push(mergedSrtItem)
    } else {
      mergedSrtList.push(currentSrtItem)
    }
  }
  mergedSrtList.forEach((item) => {
    // split text by \n
    const textArray = item.text.split('\n')
    item.text = `${textArray[0]}${textArray[2]}`
    item.ch = `${textArray[1]}${textArray[3]}`
  })
  console.log(mergedSrtList)
  return mergedSrtList
}

const subtitle = ref<Line>({
  id: '',
  startSeconds: 0,
  endSeconds: 0,
  text: '',
  ch: ''
})
watch(
  () => props.player?.currentStartSeconds,
  () => {
    const currentStartSeconds = props.player.currentStartSeconds
    for (let i = 0; i < handledSrtList.value.length; i++) {
      const currentSrtItem = handledSrtList.value[i]
      const nextSrtItem = handledSrtList.value[i + 1]
      if (
        currentStartSeconds >= currentSrtItem.startSeconds &&
        (!nextSrtItem || currentStartSeconds < nextSrtItem.startSeconds)
      ) {
        subtitle.value = { ...currentSrtItem }
        break
      }
    }
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
