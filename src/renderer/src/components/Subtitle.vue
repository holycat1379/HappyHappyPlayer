<template>
  <div class="subtitle-item pt-10">
    <div class="ch-box h-20 text-2xl w-auto bg-dark-50 text-center">
      <Transition>
        <p v-show="enShow">
          <span
            v-for="(word, index) in words"
            :key="index"
            class="ml-2 cursor-help"
            @mouseover="highlightWord(index)"
          >
            <n-popover trigger="hover" style="width: 500px; max-height: 500px" scrollable>
              <template #trigger>
                <span :class="{ highlight: highlightedWordIndex === index }"> {{ word }} </span>
              </template>
              <div>
                <Word v-bind="translation"></Word>
              </div>
            </n-popover>
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
import { throttle } from 'lodash'
import Word from './Word.vue'
import useYoudaoTranslation from '@renderer/hook/useTranslation'
const chShow = ref<boolean>(false)
const enShow = ref<boolean>(false)
const isShowDict = ref(false)
const props = defineProps<{
  srtList: Line[]
  player: InstanceType<typeof Player>
}>()

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
    item.text = `${textArray[0]} ${textArray[2]}`
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
const { translate, translation } = useYoudaoTranslation(
  '362903ece35a84a7',
  'kF00zRyW52TdegYX77Wkx95B6JgAJnbY'
)
const highlightedWordIndex = ref()
const wordDictionary = ref()
const highlightWord = (index: number | null) => {
  wordDictionary.value = []
  highlightedWordIndex.value = index
  getWord(words.value[index], wordDictionary)
}
const getWord = throttle(async (word, wordDictionary) => {
  console.log(word)
  if (word) {
    // 去除word中的符号
    word = word.replace(/[.,#!$%^&*;:{}=\-_`~()]/g, '')
    console.log(word)
    await translate(word)
    console.log(translation.value)
    // fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`).then(async (response) => {
    //   wordDictionary.value = await response.json()
    // })
  }
}, 1000)

watch(
  () => props.player?.currentStartSeconds,
  () => {
    highlightedWordIndex.value = null
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
