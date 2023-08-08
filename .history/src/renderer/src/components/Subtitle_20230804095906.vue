<template>
  <div class="subtitle-item pt-10">
    <div class="ch-box h-20 text-2xl w-auto bg-dark-50 text-center" @mouseup="getSelectedText">
      <Transition>
        <p v-show="enShow">
          <span
            v-for="(word, index) in words"
            :key="index"
            :class="{ highlight: highlightedWordIndex === index }"
            @mouseover="highlightWord(index)"
            @mouseout="highlightWord(null)"
            class="ml-2"
          >
            {{ word }}
          </span>
        </p>
      </Transition>
    </div>

    <div
      class="ch-box h-15 text-2xl w-auto mt-4 bg-dark-50 text-center"
      @mouseover="chShow = true"
      @mouseout="chShow = false"
    >
      <Transition>
        <p v-show="chShow">{{ subtitle.ch }}</p>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'srt-parser-2'
import Player from './components/Player.vue'
import { watchEffect, ref, watch, onMounted, computed } from 'vue'

const chShow = ref<boolean>(false)
const enShow = ref<boolean>(false)

const props = defineProps<{
  srtList: Line[]
  player: InstanceType<typeof Player>
}>()

function getSelectedText(): void {
  const selection = window.getSelection()
  console.log(selection)
  const selectedText = selection.toString()
  console.log(selectedText)
  if (selectedText) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`).then((response) => {
      const data = response.json()
      console.log(data)
    })
  }
}
const handledSrtList = ref<Line[]>([])
watchEffect(() => {
  handledSrtList.value = youtubeModeSrtHandle(props.srtList)
})

// check if the current video is paused

props.player?.instance.on('timeupdate', () => {
  if (props.player?.instance.paused()) {
    enShow.value = true
    chShow.value = false
  } else {
    enShow.value = false
    chShow.value = false
  }
})

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

const words = computed(() => {
  return subtitle.value.text.split(' ')
})
const highlightedWord = ref('')
const highlightedWordIndex = ref(null)

function highlightWord(index: number) {
  highlightedWord.value = words.value[index]
  highlightedWordIndex.value = index
}

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

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.highlight {
  background-color: #18a058;
}
</style>
