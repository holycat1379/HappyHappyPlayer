<template>
  <div class="subtitle-item"></div>
</template>

<script setup lang="ts">
import { Line } from 'srt-parser-2'
import Player from './components/Player.vue'
import { ref, watch } from 'vue'
import { check_is_jp } from '@renderer/utils/utli'

const props = defineProps<{ srtArray: Line[]; player: InstanceType<typeof Player> }>()

const currentItem = ref<Line>()

// 监听当前播放时间
watch(
  () => props.player?.currentStartSeconds,
  () => {
    const resultArray: Line[] = []
    props.srtArray.forEach((item, index) => {
      // 如果是最后一个 则下一个开始时间为0 也就是视频结束时间
      let nextStartSeconds = props.srtArray[index + 1] ? props.srtArray[index + 1].startSeconds : 0

      // 如果两者相等说明存在同样两个的时间 就需要判断下一个的下一个时间
      if (nextStartSeconds === item.startSeconds && props.srtArray[index + 2]) {
        nextStartSeconds = props.srtArray[index + 2].startSeconds
      }

      // 如果当前时间大于等于当前字幕开始时间 并且小于下一个字幕开始时间 则说明当前字幕正在播放
      if (
        props.player?.currentStartSeconds >= item.startSeconds &&
        props.player?.currentStartSeconds < nextStartSeconds
      ) {
        resultArray.push(item)
      }
    })

    // 如果有多个字幕正在播放 则优先选择日文字幕
    if (resultArray.length > 1) {
      resultArray.forEach((item) => {
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
  }
)

// 当前字幕点击事件
const handleSubtitleClick = (subtitle): void => {
  const element = document.getElementById(subtitle.id)
  if (element) {
    element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' })
    props.player?.instance.currentTime(subtitle.startSeconds)
  }
}
</script>

<style scoped></style>
